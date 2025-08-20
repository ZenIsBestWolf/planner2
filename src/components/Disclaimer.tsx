import React, { FC, useCallback } from 'react';
import { useApp, useUpdateApp } from '../providers';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

export const Disclaimer: FC = () => {
  const { seenDisclaimer } = useApp();
  const updateApp = useUpdateApp();
  const agree = useCallback(() => {
    updateApp('seenDisclaimer', true);
  }, [updateApp]);

  if (seenDisclaimer) {
    return null;
  }

  return (
    <Modal backdrop="static" isOpen>
      <ModalHeader>Disclaimer</ModalHeader>
      <ModalBody>
        <p>
          This application is <strong>not</strong> associated with Worcester Polytechnic Institute.
          This project is created by a student and is still in progress. Do not use this tool to
          create your schedule at this time.
        </p>
        <p>
          By continuing, you understand that this tool is <strong>not official</strong> and WPI is
          not responsible for any information displayed, correct or otherwise.
        </p>
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" tag="a" rel="noreferrer" href="https://planner.wpi.edu/">
          Open the Official WPI Planner
        </Button>
        <Button color="primary" onClick={agree}>
          I Understand
        </Button>
      </ModalFooter>
    </Modal>
  );
};
