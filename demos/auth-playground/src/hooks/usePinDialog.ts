import { useState } from 'react';
import { useIonModal } from '@ionic/react';
import AppPinDialog from '@/components/AppPinDialog';

export const usePinDialog = () => {
  const [isPasscodeSetRequest, setIsPasscodeSetRequest] = useState(false);
  const [presentPinDialog, dismissPinDialog] = useIonModal(AppPinDialog, {
    setPasscodeMode: isPasscodeSetRequest,
    dismiss: (data?: unknown, role?: string) => dismissPinDialog(data, role),
  });

  return async (isPasscodeSetRequest: boolean): Promise<string> => {
    setIsPasscodeSetRequest(isPasscodeSetRequest);
    const data = await new Promise<string>((resolve) => {
      presentPinDialog({
        backdropDismiss: false,
        onDidDismiss: (event) => resolve(event.detail.data as string),
      });
    });
    return data || '';
  };
};
