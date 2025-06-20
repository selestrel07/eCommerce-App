import { Context, FC, use } from 'react';
import { Modal } from 'antd';
import { ProfileContextEditMode } from '@contexts';
import { ProfileContextEditModeType, ProfileModalProps } from '@interfaces';

export const ProfileModal: FC<ProfileModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  handleRemove,
}) => {
  const { profileEditMode, setProfileEditMode, editComponent } = use(
    ProfileContextEditMode as Context<ProfileContextEditModeType>
  );
  return (
    <Modal
      title="Address deletion"
      closable={{ 'aria-label': 'Custom Close Button' }}
      open={isModalOpen}
      onOk={() => {
        if (profileEditMode && editComponent === '') setProfileEditMode(false);
        handleRemove();
      }}
      onCancel={() => setIsModalOpen(false)}
    >
      <p>You will not be able to undo address deletion</p>
      <p>Do you really want to delete the address?</p>
    </Modal>
  );
};
