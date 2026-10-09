import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ItemDeCompra } from '../types';

interface Props {
  item: ItemDeCompra;
  aoRemover: (id: string) => void;
}

function calcularSubtotal(preco: string, quantidade: number) {
  const valorUnitario = Number.parseFloat(preco.replace(',', '.'));
  if (!Number.isFinite(valorUnitario)) return null;
  const formatarMoeda = (valor: number) => `R$ ${valor.toFixed(2).replace('.', ',')}`;
  return `${quantidade} \u00d7 ${formatarMoeda(valorUnitario)} = ${formatarMoeda(valorUnitario * quantidade)}`;
}

export default function ItemCompra({ item, aoRemover }: Props) {
  const subtotal = item.preco ? calcularSubtotal(item.preco, item.quantidade) : null;
  return <View style={styles.card}>
    <View style={styles.body}>
      <Text style={styles.name}>{item.nome}</Text>
      <Text style={styles.qty}>{'Quantidade: '}{item.quantidade}</Text>
      {subtotal ? <Text style={styles.price}>{subtotal}</Text> : null}
    </View>
    <Pressable accessibilityRole="button" accessibilityLabel={`Remover ${item.nome} da lista`} onPress={() => aoRemover(item.id)} style={styles.delete}>
      <Text>{'\u{1F5D1}\uFE0F'}</Text>
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 },
  body: { flex: 1 },
  name: { color: '#1F2937', fontSize: 17, fontWeight: '600' },
  qty: { color: '#6B7280', fontSize: 14, marginTop: 4 },
  price: { color: '#4F46E5', fontSize: 14, fontWeight: '600', marginTop: 4 },
  delete: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEF2F2' },
});
