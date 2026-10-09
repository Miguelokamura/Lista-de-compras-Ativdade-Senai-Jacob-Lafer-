export interface ItemDeCompra {
  id: string;
  nome: string;
  quantidade: number;
  preco?: string;
}

export interface ListaFinalizada {
  itens: ItemDeCompra[];
  total: number;
  finalizadaEm: string;
}
