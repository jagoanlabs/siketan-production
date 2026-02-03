declare module "@tawk.to/tawk-messenger-react" {
  import { ComponentType } from "react";

  export interface TawkMessengerReactProps {
    propertyId: string;
    widgetId?: string;
    customStyle?: {
      visibility?: {
        desktop?: {
          position?: string;
          xOffset?: string;
          yOffset?: string;
        };
        mobile?: {
          position?: string;
          xOffset?: string;
          yOffset?: string;
        };
      };
      zIndex?: number;
    };
    onLoad?: () => void;
    onStatusChange?: (status: string) => void;
    onBeforeLoad?: () => void;
    onChatMaximized?: () => void;
    onChatMinimized?: () => void;
    onChatHidden?: () => void;
    onChatStarted?: () => void;
    onChatEnded?: () => void;
    onPrechatSubmit?: (data: any) => void;
    onOfflineSubmit?: (data: any) => void;
    onChatMessageVisitor?: (message: any) => void;
    onChatMessageAgent?: (message: any) => void;
    onChatMessageSystem?: (message: any) => void;
    onAgentJoinChat?: (data: any) => void;
    onAgentLeaveChat?: (data: any) => void;
    onChatSatisfaction?: (satisfaction: any) => void;
    onVisitorNameChanged?: (visitorName: any) => void;
    onFileUpload?: (link: string) => void;
    onTagsUpdated?: (data: any) => void;
    onUnreadCountChanged?: (unreadCount: number) => void;
  }

  const TawkMessengerReact: ComponentType<TawkMessengerReactProps>;
  export default TawkMessengerReact;
}
