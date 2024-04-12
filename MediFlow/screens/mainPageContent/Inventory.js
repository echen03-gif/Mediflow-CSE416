import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DataTable, TextInput } from 'react-native-paper';
import { theme } from '../../core/theme';
import Button from '../../components/Button';
import MainPageHeader from '../../components/MainPageHeader'

export default function Inventory() {
  const [page, setPage] = React.useState(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

  const inventoryData = [
    { key: '1', name: 'CT Machine', location: 'Room A1', status: 'Yes' },
    { key: '2', name: 'X-Ray', location: 'Room A2', status: 'No' },
    { key: '3', name: 'MRI Machine', location: 'Room B1', status: 'Yes' },
    { key: '4', name: 'Ventilator', location: 'Room B2', status: 'Yes' },
    { key: '5', name: 'Defibrillator', location: 'Room C1', status: 'No' },
    { key: '6', name: 'EEG Machine', location: 'Room C2', status: 'Yes' },
  ];

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, inventoryData.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <View style={styles.container}>
      <MainPageHeader>Inventory</MainPageHeader>
      <View style={styles.searchContainer}>
        <TextInput label="Search" variant="outlined" />
        <Button mode="contained" style={styles.dateButton}>
          Date
        </Button>
      </View>
      <Button mode="contained" style={styles.addButton}>
        Add Inventory
      </Button>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Product</DataTable.Title>
          <DataTable.Title numeric>Location</DataTable.Title>
          <DataTable.Title numeric>Status</DataTable.Title>
        </DataTable.Header>

        {inventoryData.slice(from, to).map((item) => (
          <DataTable.Row key={item.key}>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.location}</DataTable.Cell>
            <DataTable.Cell numeric>{item.status}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(inventoryData.length / itemsPerPage)}
          onPageChange={page => setPage(page)}
          label={`${from + 1}-${to} of ${inventoryData.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateButton: {
    marginLeft: 10,
  },
  addButton: {
    marginTop: 10,
    color: theme.colors.primary,
  },
});
