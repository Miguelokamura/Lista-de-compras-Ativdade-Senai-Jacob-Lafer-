import { StyleSheet, Text, View } from 'react-native';
export default function Cabecalho() { return <View style={s.box}><Text style={s.icon}>🛒</Text><Text style={s.title}>Lista de Compras</Text><Text style={s.sub}>Organize suas compras com facilidade</Text></View>; }
const s=StyleSheet.create({box:{alignItems:'center',paddingVertical:20},icon:{fontSize:42},title:{fontSize:28,fontWeight:'700',color:'#1F2937'},sub:{fontSize:15,color:'#6B7280',marginTop:6}});
