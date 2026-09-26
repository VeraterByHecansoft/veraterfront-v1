
import { AppDispatch } from "@/contexts/store";
import { succesLoginType, UserType } from "@/types/authTypes";
import { TResp, TSocketResponse } from "@/types/socketTypes";
import { safeJsonParse } from "@/utils/JSON";

export const messageProcesor = (dispatch: AppDispatch, message: any) => {
  try {
    let raw = message?.data || message;
    let data = typeof raw === 'string' ? safeJsonParse(raw) : raw;

    if (!data)
      return console.warn('invalid Response');

  } catch (error) {
    console.error('Error', error);
  }
}