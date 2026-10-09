import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface FormularioItemProps {
  aoAdicionar: (nome: string, quantidade: number, preco: string) => void;
}

export default function FormularioItem({ aoAdicionar }: FormularioItemProps) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [preco, setPreco] = useState('');

  function enviar() {
    const nomeLimpo = nome.trim();
    const quantidadeNumero = Number.parseInt(quantidade, 10);
    if (!nomeLimpo) {
      Alert.alert('Aten\u00e7\u00e3o', 'Digite o nome do produto.');
      return;
    }
    if (!Number.isFinite(quantidadeNumero) || quantidadeNumero < 1) {
      Alert.alert('Aten\u00e7\u00e3o', 'Informe uma quantidade v\u00e1lida (m\u00ednimo 1).');
      return;
    }

    aoAdicionar(nomeLimpo, quantidadeNumero, preco);
    setNome('');
    setQuantidade('1');
    setPreco('');
  }

  return <View style={styles.card}>
    <Text style={styles.label}>Adicionar produto</Text>
    <TextInput
      accessibilityLabel="Nome do produto"
      placeholder={'Ex.: Caf\u00e9'}
      value={nome}
      onChangeText={setNome}
      onSubmitEditing={enviar}
      style={styles.input}
    />
    <View style={styles.row}>
      <TextInput
        accessibilityLabel="Quantidade"
        keyboardType="number-pad"
        value={quantidade}
        onChangeText={setQuantidade}
        style={[styles.input, styles.quantity]}
      />
      <View style={[styles.input, styles.priceField]}>
        <Text style={styles.currency}>R$</Text>
        <TextInput
          accessibilityLabel="Pre\u00e7o unit\u00e1rio do produto"
          keyboardType="decimal-pad"
          placeholder="0,00"
          value={preco}
          onChangeText={(valor) => setPreco(valor.replace(/[^0-9,.]/g, ''))}
          style={styles.priceInput}
        />
      </View>
    </View>
    <Pressable accessibilityRole="button" onPress={enviar} style={styles.button}>
      <Text style={styles.buttonText}>+ Adicionar</Text>
    </Pressable>
  </View>;
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginBottom: 20, elevation: 2 },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 12 },
  input: { backgroundColor: '#F7F8FA', borderColor: '#E5E7EB', borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#111827' },
  row: { flexDirection: 'row', gap: 10, marginTop: 10 },
  quantity: { flex: 1 },
  priceField: { flex: 2, flexDirection: 'row', alignItems: 'center', gap: 6 },
  currency: { color: '#6B7280', fontSize: 15 },
  priceInput: { flex: 1, padding: 0, fontSize: 16, color: '#111827' },
  button: { backgroundColor: '#4F46E5', borderRadius: 10, alignItems: 'center', justifyContent: 'center', paddingVertical: 13, marginTop: 10 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
