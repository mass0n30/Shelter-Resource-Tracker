
import styles from '../../styles/components/client.module.css';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

function ClientList() {

  return (
    <div className={'clientList'}>
      <ClientToggleSection className={styles.clientToggleSection} />
      <div className={`${styles.clientListStack} stack`}>
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
        <ClientCard/>
      </div>
    </div>
  );
}

import { ClientCombobox } from '../partials/ComboBox';

function ClientToggleSection() {

  return (
    <div className={styles.clientToggleSection}>
      <ClientCombobox />
      <div className={styles.clientSearchInputContainer}>
        <div className={styles.clientSearchInput}>
          <Input placeholder='Search Clients' />
          <div className={styles.clientSearchButton}>
            <Button>Search</Button>
          </div>
        </div>
        <div className={styles.clientFilterDropDown}>
          <Button>Filter</Button>
        </div>
      </div>

    </div>
  );
}

function ClientCard() {

  return (
    <div className={styles.clientCard}>
      <h3>Client Card</h3>
    </div>
  );
}

export default ClientList;