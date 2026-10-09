import { StyleSheet, Text, TextInput, View } from 'react-native';
import type { ItemDeCompra } from '../types';

interface Props {
  itens: ItemDeCompra[];
  precos: Record<string, string>;
  aoAlterarPreco: (id: string, preco: string) => void;
}

function numeroPreco(valor: string) {
  const numero = Number.parseFloat(valor.replace(',', '.'));
  return Number.isFinite(numero) && numero > 0 ? numero : 0;
}

function moeda(valor: number) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

export default function CalculadoraCompras({ itens, precos, aoAlterarPreco }: Props) {
  const total = itens.reduce(
    (soma, item) => soma + numeroPreco(precos[item.id] ?? '') * item.quantidade,
    0,
  );

  return <View style={styles.section}>
    <Text style={styles.title}>{'C\u00e1lculo das compras'}</Text>
    <Text style={styles.hint}>{'Informe o pre\u00e7o unit\u00e1rio de cada produto. O total \u00e9 atualizado automaticamente.'}</Text>
    {itens.length === 0 ? (
      <Text style={styles.empty}>{'Adicione produtos \u00e0 lista para calcular suas compras.'}</Text>
    ) : itens.map((item) => {
      const precoUnitario = numeroPreco(precos[item.id] ?? '');
      const subtotal = precoUnitario * item.quantidade;
      return <View key={item.id} style={styles.card}>
        <View style={styles.product}>
          <Text style={styles.name}>{item.nome}</Text>
          <Text style={styles.quantity}>{'Quantidade: '}{item.quantidade}</Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.currency}>R$</Text>
          <TextInput
            accessibilityLabel={`Pre\u00e7o unit\u00e1rio de ${item.nome}`}
            keyboardType="decimal-pad"
            placeholder="0,00"
            value={precos[item.id] ?? ''}
            onChangeText={(valor) => aoAlterarPreco(item.id, valor.replace(/[^0-9,.]/g, ''))}
            style={styles.input}
          />
          <Text style={styles.subtotal}>{moeda(subtotal)}</Text>
        </View>
      </View>;
    })}
    <View style={styles.totalCard}>
      <Text style={styles.totalLabel}>Total estimado</Text>
      <Text style={styles.total}>{moeda(total)}</Text>
    </View>
  </View>;
}

const styles = StyleSheet.create({
  section: { marginTop: 24 },
  title: { color: '#1F2937', fontSize: 21, fontWeight: '700' },
  hint: { color: '#6B7280', fontSize: 14, marginTop: 5, marginBottom: 14, lineHeight: 20 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 14, padding: 15, marginBottom: 10, elevation: 1 },
  product: { marginBottom: 10 },
  name: { color: '#1F2937', fontSize: 16, fontWeight: '600' },
  quantity: { color: '#6B7280', fontSize: 13, marginTop: 3 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currency: { color: '#6B7280', fontSize: 15 },
  input: { flex: 1, backgroundColor: '#F7F8FA', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 9, paddingHorizontal: 10, paddingVertical: 8, color: '#111827' },
  subtotal: { minWidth: 82, textAlign: 'right', color: '#374151', fontWeight: '600' },
  empty: { color: '#9CA3AF', paddingVertical: 12 },
  totalCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#EEF2FF', borderRadius: 14, padding: 17, marginTop: 6 },
  totalLabel: { color: '#374151', fontSize: 16, fontWeight: '600' },
  total: { color: '#4338CA', fontSize: 22, fontWeight: '700' },
});
