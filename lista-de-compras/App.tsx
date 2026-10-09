import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Alert, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import Cabecalho from './components/Cabecalho';
import FormularioItem from './components/FormularioItem';
import ListaCompras from './components/ListaCompras';
import type { ItemDeCompra, ListaFinalizada } from './types';

function obterValor(preco?: string) {
  const valor = Number.parseFloat((preco ?? '').replace(',', '.'));
  return Number.isFinite(valor) && valor > 0 ? valor : 0;
}

function moeda(valor: number) {
  return `R$ ${valor.toFixed(2).replace('.', ',')}`;
}

function carregarListasAnteriores(): ListaFinalizada[] {
  if (Platform.OS !== 'web') return [];
  try {
    const salva = globalThis.localStorage?.getItem('lista-de-compras-anterior');
    if (!salva) return [];
    const dados: unknown = JSON.parse(salva);
    if (Array.isArray(dados)) return dados as ListaFinalizada[];
    if (dados && typeof dados === 'object' && 'itens' in dados) return [dados as ListaFinalizada];
    return [];
  } catch {
    return [];
  }
}

export default function App() {
  const [itens, setItens] = useState<ItemDeCompra[]>([
    { id: '1', nome: 'Ma\u00e7\u00e3', quantidade: 3 },
    { id: '2', nome: 'Arroz', quantidade: 1 },
    { id: '3', nome: 'Leite', quantidade: 2 },
  ]);
  const [listasAnteriores, setListasAnteriores] = useState<ListaFinalizada[]>(carregarListasAnteriores);
  const [historicoVisivel, setHistoricoVisivel] = useState(false);
  const total = itens.reduce((soma, item) => soma + obterValor(item.preco) * item.quantidade, 0);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    globalThis.localStorage?.setItem('lista-de-compras-anterior', JSON.stringify(listasAnteriores));
  }, [listasAnteriores]);

  function adicionarItem(nome: string, quantidade: number, preco: string) {
    const id = `${Date.now()}-${Math.random()}`;
    setItens((atuais) => [...atuais, { id, nome, quantidade, preco }]);
  }

  function removerItem(id: string) {
    setItens((atuais) => atuais.filter((item) => item.id !== id));
  }

  function confirmarFinalizacao() {
    if (itens.length === 0) return;
    const mensagem = `A lista ser\u00e1 salva com o total de ${moeda(total)} e os produtos atuais ser\u00e3o removidos.`;
    const finalizar = () => {
      setListasAnteriores((anteriores) => [
        { itens: [...itens], total, finalizadaEm: new Date().toISOString() },
        ...anteriores,
      ]);
      setItens([]);
    };

    if (Platform.OS === 'web') {
      if (globalThis.confirm(mensagem)) finalizar();
      return;
    }

    Alert.alert('Finalizar lista?', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Confirmar', style: 'destructive', onPress: finalizar },
    ]);
  }

  function confirmarExclusaoHistorico(apenasUltimasCinco: boolean) {
    if (listasAnteriores.length === 0) return;
    const mensagem = apenasUltimasCinco
      ? 'Deseja excluir as 5 listas mais recentes?'
      : 'Deseja excluir somente a lista mais recente?';
    const excluir = () => {
      setListasAnteriores((anteriores) => anteriores.slice(apenasUltimasCinco ? 5 : 1));
    };

    if (Platform.OS === 'web') {
      if (globalThis.confirm(mensagem)) excluir();
      return;
    }

    Alert.alert('Confirmar exclusão', mensagem, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: excluir },
    ]);
  }

  return <SafeAreaView style={styles.safeArea}>
    <StatusBar style="dark" />
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Cabecalho />
      <FormularioItem aoAdicionar={adicionarItem} />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: historicoVisivel }}
        onPress={() => setHistoricoVisivel((visivel) => !visivel)}
        style={styles.historyToggle}
      >
        <Text style={styles.historyButtonText}>
          {historicoVisivel ? 'Ocultar listas anteriores' : 'Ver listas anteriores'}
          {' ('}{listasAnteriores.length}{')'}
        </Text>
      </Pressable>
      {historicoVisivel ? (
        listasAnteriores.length > 0 ? <>
          <View style={styles.historyActions}>
            <Pressable accessibilityRole="button" onPress={() => confirmarExclusaoHistorico(false)} style={styles.deleteAllButton}>
              <Text style={styles.deleteAllText}>Excluir 1 lista</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => confirmarExclusaoHistorico(true)} style={styles.deleteRecentButton}>
              <Text style={styles.deleteRecentText}>Excluir últimas 5</Text>
            </Pressable>
          </View>
          {listasAnteriores.map((lista, indice) => (
          <View key={lista.finalizadaEm + indice} style={styles.previousCard}>
            <Text style={styles.previousTitle}>
              {indice === 0 ? 'Lista anterior' : `Lista ${listasAnteriores.length - indice}`}
            </Text>
            <Text style={styles.previousDate}>
              {'Finalizada em '}{new Date(lista.finalizadaEm).toLocaleString('pt-BR')}
            </Text>
            {lista.itens.map((item) => (
              <Text key={item.id} style={styles.previousItem}>
                {item.quantidade}{' \u00d7 '}{item.nome}
                {item.preco ? ` - ${moeda(obterValor(item.preco))} cada` : ''}
              </Text>
            ))}
            <Text style={styles.previousTotal}>{'Total: '}{moeda(lista.total)}</Text>
          </View>
          ))}
        </> : <Text style={styles.emptyHistory}>{'Ainda n\u00e3o h\u00e1 listas finalizadas.'}</Text>
      ) : null}
      <ListaCompras itens={itens} aoRemover={removerItem} />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total da lista</Text>
          <Text style={styles.total}>{moeda(total)}</Text>
        </View>
        <Text style={styles.footerHint}>
          {itens.some((item) => obterValor(item.preco) === 0)
            ? 'Informe o pre\u00e7o dos produtos para incluir tudo no total.'
            : 'Total calculado pela quantidade e pelo pre\u00e7o unit\u00e1rio.'}
        </Text>
        <Pressable
          accessibilityRole="button"
          disabled={itens.length === 0}
          onPress={confirmarFinalizacao}
          style={[styles.finishButton, itens.length === 0 && styles.disabledButton]}
        >
          <Text style={styles.finishButtonText}>Finalizar lista</Text>
        </Pressable>
      </View>
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F7F8FA' },
  container: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24 },
  historyToggle: { alignSelf: 'flex-start', backgroundColor: '#E0E7FF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 12 },
  historyButtonText: { color: '#4338CA', fontSize: 15, fontWeight: '600' },
  historyActions: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  deleteAllButton: { backgroundColor: '#FEE2E2', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 9 },
  deleteAllText: { color: '#B91C1C', fontSize: 13, fontWeight: '600' },
  deleteRecentButton: { backgroundColor: '#FFF7ED', borderRadius: 9, paddingHorizontal: 12, paddingVertical: 9 },
  deleteRecentText: { color: '#C2410C', fontSize: 13, fontWeight: '600' },
  previousCard: { backgroundColor: '#EEF2FF', borderRadius: 14, padding: 16, marginBottom: 12 },
  previousTitle: { color: '#3730A3', fontSize: 17, fontWeight: '700' },
  previousDate: { color: '#6B7280', fontSize: 12, marginTop: 4, marginBottom: 8 },
  previousItem: { color: '#374151', fontSize: 14, marginTop: 4 },
  previousTotal: { color: '#3730A3', fontWeight: '700', fontSize: 16, marginTop: 10 },
  emptyHistory: { color: '#6B7280', paddingVertical: 10 },
  footer: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18, marginTop: 16, elevation: 2, shadowColor: '#111827', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#374151', fontSize: 17, fontWeight: '600' },
  total: { color: '#4338CA', fontSize: 23, fontWeight: '700' },
  footerHint: { color: '#6B7280', fontSize: 13, marginTop: 8, lineHeight: 18 },
  finishButton: { backgroundColor: '#4F46E5', borderRadius: 10, alignItems: 'center', paddingVertical: 14, marginTop: 14 },
  disabledButton: { backgroundColor: '#A5B4FC' },
  finishButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
