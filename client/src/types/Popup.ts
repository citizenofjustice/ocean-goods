type MessageType = "success" | "error";

export interface PopupMessage {
  message: string;
  type: MessageType;
}
