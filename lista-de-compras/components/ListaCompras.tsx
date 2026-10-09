import { StyleSheet, Text, View } from 'react-native';
import type { ItemDeCompra } from '../types';
import ItemCompra from './ItemCompra';

export default function ListaCompras({ itens, aoRemover }: { itens: ItemDeCompra[]; aoRemover: (id: string) => void }) {
  return <View style={styles.box}>
    <Text style={styles.title}>Seus produtos ({itens.length})</Text>
    {itens.length === 0 ? (
      <Text style={styles.message}>Sua lista está vazia. Adicione um produto acima!</Text>
    ) : itens.map((item) => (
      <ItemCompra key={item.id} item={item} aoRemover={aoRemover} />
    ))}
  </View>;
}

const styles = StyleSheet.create({
  box: { marginTop: 4 },
  title: { fontSize: 18, fontWeight: '700', color: '#374151', marginBottom: 12 },
  message: { color: '#9CA3AF', textAlign: 'center', fontSize: 15, paddingHorizontal: 24, paddingVertical: 16 },
});
