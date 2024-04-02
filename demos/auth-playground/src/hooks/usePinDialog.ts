import { useState } from 'react';
import { useIonModal } from '@ionic/react';
import AppPinDialog from '@/components/AppPinDialog';

export const usePinDialog = () => {
  const [isPasscodeSetRequest, setIsPasscodeSetRequest] = useState(false);
  const [presentPinDialog, dismissPinDialog] = useIonModal(AppPinDialog, {
    setPasscodeMode: isPasscodeSetRequest,
    dismiss: (data?: any, role?: string) => dismissPinDialog(data, role),
  });

  const onPasscodeRequested = async (isPasscodeSetRequest: boolean): Promise<string> => {
    setIsPasscodeSetRequest(isPasscodeSetRequest);
    const data = await new Promise<any>((resolve) => {
      presentPinDialog({
        backdropDismiss: false,
        onDidDismiss: (event) => resolve(event.detail.data),
      });
    });
    return data || '';
  };

  return onPasscodeRequested;
};
