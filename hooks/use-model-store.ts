import { create } from 'zustand';
import {Server,channelType} from '@prisma/client'
export type ModelType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer";
interface ModelData{
  server?:Server;
  ChannelType?:channelType
}

interface ModelStore {
  type: ModelType | null;
// Suggested code may be subject to a license. Learn more: ~LicenseLog:1261718142.
  data:ModelData;
  isOpen: boolean;
  onOpen: (type: ModelType,data:ModelData) => void;
  onClose: () => void;
}

export const useModel = create<ModelStore>((set) => ({
  type: null,
  data:{},
  isOpen: false,
  onOpen: (type,data={}) => set({ isOpen: true, type,data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
