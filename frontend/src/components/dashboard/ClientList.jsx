
import styles from '../../styles/components/client.module.css';

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

function ClientToggleSection() {

  return (
    <div className={styles.clientToggleSection}>
      <div className={styles.clientSearchInputContainer}>
        <div className={styles.clientSearchInput}>
          <input type="text" placeholder='Search Clients...' />
          <div className={styles.clientSearchButton}>
            <button>Search</button>
          </div>
        </div>
        <div className={styles.clientFilterDropDown}>
          <button>Filter</button>
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