
import styles from "./components/client.module.css";

function ClientListSection() {

  return (
    <div className={styles.clientListSection}>
      <ClientCard/>
      <ClientCard/>
      <ClientCard/>
      <ClientCard/>
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

export default ClientListSection;