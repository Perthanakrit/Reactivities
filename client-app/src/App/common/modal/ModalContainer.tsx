import { observer } from "mobx-react-lite";
import React from "react";
import { useStore } from "../../stores/store";
import { Modal } from "semantic-ui-react";

type Props = {};

export default observer(function ModalContainer({}: Props) {
  const { modalStore } = useStore();

  return (
    <Modal
      open={modalStore.modal.open}
      onClose={modalStore.closeModal}
      size="mini"
    >
      {modalStore.modal.body}
    </Modal>
  );
});
