export const MsgType = {
  runScript: "runScript",
  getTabId: "getTabId",
};

export const ClickType = {
  onClick: "onClick",
  onClickExtension: "onClickExtension",
  onClickContentScript: "onClickContentScript",
};

export const Events = {
  onDocumentStart: "onDocumentStart",
  onDocumentIdle: "onDocumentIdle",
  onDocumentEnd: "onDocumentEnd",
};

export const EventMap = {
  [Events.onDocumentStart]: "document_start",
  [Events.onDocumentIdle]: "document_idle",
  [Events.onDocumentEnd]: "document_end",
};
