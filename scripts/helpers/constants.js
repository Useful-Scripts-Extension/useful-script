export const MsgType = {
  runScript: "runScript",
};

export const ScriptType = {
  contentScript: "contentScript",
  backgroundScript: "backgroundScript",
};

export const OnClickType = {
  onClick: "onClick",
  onClickExtension: "onClickExtension",
  onClickContentScript: "onClickContentScript",
};

export const Events = {
  document_start: "document_start",
  document_idle: "document_idle",
  document_end: "document_end",
};

export const EventMap = {
  [Events.document_start]: "onDocumentStart",
  [Events.document_idle]: "onDocumentIdle",
  [Events.document_end]: "onDocumentEnd",
};

export const GlobalBlackList = ["edge://*", "chrome://*"];
