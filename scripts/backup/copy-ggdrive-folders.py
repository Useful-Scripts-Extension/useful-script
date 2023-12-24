#@title Input
from ipywidgets import widgets

dest_text = widgets.Text(description="Your drive", placeholder='Nhập đường link folder Google Drive của bạn')
source_text = widgets.Text(description="Shared drive", placeholder='Nhập đường link folder Google Drive shared')
from_page_text = widgets.Text(description="Từ trang", value="0")
to_page_text = widgets.Text(description="Đến trang", value="0")
max_download_size_text = widgets.Text(description="Tổng dung lượng tối đa(GB)", value="700")
exclude_str_text = widgets.Text(description="Bỏ file, folder có chứa nội dung", value="")

display(dest_text)
display(source_text)
display(from_page_text)
display(to_page_text)
display(max_download_size_text)
display(exclude_str_text)

#@title Run
import os
import time
import re
import sys
from googleapiclient.discovery import build
from google.colab import auth
from google.colab import drive

class DownloadFromDrive:
    def __init__(self):
        self._total_size = 0
        self._limit_size = 0
        self.excluded_strings = []

    def get_user_credential(self):
        auth.authenticate_user()
        drive_service = build('drive', 'v3')
        return drive_service

    def get_childs_from_folder(self, drive_service, folder_id, from_page, to_page):
        files = []
        page_token = None
        query = f"'{folder_id}' in parents and trashed = false"
        if self.excluded_strings and len(self.excluded_strings) > 0:
            not_contains_query = " and ".join([f"not name contains '{ext}'" for ext in self.excluded_strings])
            query += f" and ({not_contains_query})"

        pages = 0
        while True:
            try:
                pages += 1
                response = drive_service.files().list(q=query,
                                        orderBy='name, createdTime',
                                        fields='files(id, name, mimeType, size), nextPageToken',
                                        pageToken=page_token,
                                        supportsAllDrives=True,
                                        includeItemsFromAllDrives=True).execute()

                if (from_page < pages <= to_page) or to_page == 0:
                    files.extend(response.get('files', []))

                page_token = response.get('nextPageToken', None)
                if page_token is None or  (pages >= to_page > 0):
                    break
            except Exception as e:
                print(f"An error occurred: {str(e)}")
                page_token = None

        print(f"Total files: {len(files)}")
        return files

    def copy_file(self, drive_service, dest_folder_id, source_file):
        if source_file['mimeType'] != 'application/vnd.google-apps.folder':
            body_file_inf = {'parents': [dest_folder_id]}

            if not self.check_if_exists(drive_service, dest_folder_id, source_file['name']):
                try:
                    start_time = time.time()
                    request_copy = drive_service.files().copy(body=body_file_inf, fileId=source_file['id'],
                                                              supportsAllDrives=True).execute()
                    end_time = time.time()

                    fileSize = int(source_file.get('size', 0))
                    size_mb = fileSize / (1024 * 1024)
                    self._total_size += size_mb
                    speed_mb = size_mb / (end_time - start_time)
                    print(f"[{source_file['name']}] copied. Size {size_mb:0.2f} MB. Speed {speed_mb:0.2f} MB/s")


                    if self._total_size >= (self._limit_size * 1024):
                        self.on_total_size_exceeded(f"Total size exceeds {self._limit_size} GB. Ending the program.")
                except Exception as e:
                    print("An error occurred: ", e)
            else:
                print(f"[{source_file['name']}] exists.")
        else:

            source_files = self.get_childs_from_folder(drive_service, source_file['id'], 0, 0)
            if source_files and len(source_files) > 0:
                print(f"Copy at Folder {source_file['name']} Starting")
                sub_folder_id = self.create_folder(drive_service, dest_folder_id, source_file['name'])
                self.copy_multiple_files(drive_service, sub_folder_id, source_files)
                print(f"Copy at Folder {source_file['name']} Ending")


    def create_folder(self, drive_service, dest_folder_id, sub_folder_name):
        sub_folder_inf = {'name': sub_folder_name, 'mimeType': 'application/vnd.google-apps.folder', 'parents': [dest_folder_id]}

        exist_folder_id = self.check_if_exists(drive_service, dest_folder_id, sub_folder_name)
        if not exist_folder_id:
            try:
                folder = drive_service.files().create(body=sub_folder_inf, fields='id').execute()
                return folder['id']
            except Exception as e:
                print("An error occurred: ", e)
        return exist_folder_id


    def check_if_exists(self, drive_service, dest_folder_id, name):
        try:
            processed_name = name.replace("'", "\\'")

            results = drive_service.files().list(q=f"'{dest_folder_id}' in parents and name = '{processed_name}' and trashed=false",
                                                fields='files(id)').execute()

            if 'files' in results and len(results['files']) > 0:
                return results['files'][0]['id']
        except Exception as e:
            print("An error occurred: ", e)

        return ""


    def copy_multiple_files(self, drive_service, dest_folder_id, source_files):
        for source_file in source_files:
            self.copy_file(drive_service, dest_folder_id, source_file)

    def extract_folder_id_from_url(self, url):
        pattern = r'[-\w]{25,}'
        match = re.search(pattern, url)
        if match:
            return match.group(0)
        else:
            return None

    def on_total_size_exceeded(self, message):
        print(message)
        sys.exit()

    def copy_drive_to_drive(self, destDriveLink, sourceDriveLink, from_page, to_page):
        service = self.get_user_credential()

        start_time = time.time()
        dest_folder_id = self.extract_folder_id_from_url(destDriveLink)
        source_folder_id = self.extract_folder_id_from_url(sourceDriveLink)
        source_folder = service.files().get(fileId=source_folder_id, supportsAllDrives=True).execute()
        new_dest_folder_id = self.create_folder(service, dest_folder_id, source_folder['name'])

        source_files = self.get_childs_from_folder(service, source_folder_id, from_page, to_page)
        self.copy_multiple_files(service, new_dest_folder_id, source_files)
        end_time = time.time()

        size_gb = self._total_size / 1024
        speed_mb = self._total_size / (end_time - start_time)

        print(f"Done. Total Size {size_gb:0.2f} GB. Total Time {int(end_time - start_time)} s. SpeedMB {speed_mb:0.2f} MB/s")


# Main
destDriveLink = dest_text.value
sourceDriveLink = source_text.value
fromPage = int(from_page_text.value)
toPage = int(to_page_text.value)

downloader = DownloadFromDrive()
downloader._limit_size = float(max_download_size_text.value);
downloader.excluded_strings = [ext.strip() for ext in exclude_str_text.value.split(",") if ext.strip()]
downloader.copy_drive_to_drive(destDriveLink, sourceDriveLink, fromPage, toPage)
