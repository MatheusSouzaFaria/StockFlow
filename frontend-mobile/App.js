import React, {useEffect, useState, useRef} from 'react';
import {ActivityIndicator, Platform, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View} from 'react-native';
import {criarApi, quantidadeValida, estoqueBaixo} from './src/api.js';
const API_URL = process.env.EXPO_PUBLIC_API_URL || (Platform.OS === 'android' ? 'http://10.0.2.2:8080/api/produtos' : 'http://localhost:8080/api/produtos');
const api = criarApi(API_URL);
const c = {navy:'#142B40', muted:'#526879', teal:'#087D71', bg:'#F1F5F7', white:'#FFFFFF', border:'#DCE5EA', red:'#A82D35'};
function Botao({titulo, onPress, disabled, variante='principal'}) {
  return <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({pressed})=>[s.botao, variante==='secundario'&&s.secundario, variante==='saida'&&s.saida, (pressed||disabled)&&{opacity:0.6}]}>
    <Text style={[s.botaoTexto,variante==='secundario'&&{color:c.navy}]}>{titulo}</Text>
  </Pressable>;
}
function Status({produto}) {
  const baixo = estoqueBaixo(produto);
  return <View style={[s.badge, baixo ? s.badgeBaixo : s.badgeOk]}><Text style={{fontWeight:'700', color:baixo?'#9B3A16':'#086557'}}>{baixo?'Estoque baixo':'Estoque regular'}</Text></View>;
}
export default function App() {
  const [lista,setLista]=useState([]);
  const [produto,setProduto]=useState(null);
  const [q,setQ]=useState('');
  const [msg,setMsg]=useState(null);
  const [ocupado,setOcupado]=useState(false);
  const [carregado,setCarregado]=useState(false);
  const trava=useRef(false);
  async function executar(acao) {
    if(trava.current) return;
    trava.current=true; setOcupado(true); setMsg(null);
    try { await acao(); } catch(e) { setMsg({erro:true,texto:e.message}); }
    finally { trava.current=false; setOcupado(false); }
  }
  async function carregar() {
    const dados=await api.listar(); setLista(dados); setCarregado(true);
  }
  useEffect(()=>{ executar(carregar); },[]);
  function abrir(id) { executar(async()=>{setProduto(await api.buscar(id)); setQ('');}); }
  function voltar() { executar(async()=>{setProduto(null);setQ('');await carregar();}); }
  function atualizar() { executar(async()=>{if(produto) setProduto(await api.buscar(produto.id)); else await carregar();}); }
  function mover(tipo) {
    if(trava.current) return;
    if(!quantidadeValida(q)) {setMsg({erro:true,texto:'Digite uma quantidade inteira positiva.'});return;}
    executar(async()=>{
      const novo=await api.movimentar(produto.id,tipo,Number(q));
      setProduto(novo);setQ('');setLista(prev=>prev.map(p=>p.id===novo.id?novo:p));
      setMsg({erro:false,texto:'Movimentação registrada. Novo saldo: '+novo.quantidade});
    });
  }
  const baixos=lista.filter(estoqueBaixo).length;
  return <SafeAreaView style={s.base}>
    <StatusBar barStyle="dark-content" backgroundColor={c.bg}/>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.area}>
      <View style={s.header}><Text style={s.eyebrow}>CONTROLE DE ESTOQUE</Text><Text style={s.titulo}>StockFlow</Text><Text style={s.muted}>Movimentações e consulta de produtos</Text></View>
      {produto ? <>
        <Botao titulo="‹ Voltar para produtos" variante="secundario" onPress={voltar} disabled={ocupado}/>
        <View style={s.card}>
          <Text style={s.eyebrow}>{produto.categoria}</Text><Text style={s.nomeGrande}>{produto.nome}</Text>
          {!!produto.descricao&&<Text style={s.muted}>{produto.descricao}</Text>}
          <Status produto={produto}/>
          <View style={s.metricas}><View style={s.metrica}><Text style={s.muted}>Saldo atual</Text><Text style={s.numero}>{produto.quantidade}</Text></View><View style={s.metrica}><Text style={s.muted}>Estoque mínimo</Text><Text style={s.numero}>{produto.estoqueMinimo}</Text></View></View>
          <Botao titulo="Atualizar saldo" variante="secundario" onPress={atualizar} disabled={ocupado}/>
        </View>
        <View style={s.card}><Text style={s.nome}>Registrar movimentação</Text><Text style={s.muted}>Informe quantas unidades deseja adicionar ou retirar.</Text>
          <TextInput accessibilityLabel="Quantidade da movimentação" style={s.input} placeholder="Ex.: 8" placeholderTextColor="#8293A0" keyboardType="number-pad" value={q} onChangeText={setQ} editable={!ocupado}/>
          <View style={s.metricas}><View style={{flex:1}}><Botao titulo="+ Entrada" onPress={()=>mover('ENTRADA')} disabled={ocupado}/></View><View style={{flex:1}}><Botao titulo="− Saída" variante="saida" onPress={()=>mover('SAIDA')} disabled={ocupado}/></View></View>
        </View>
      </> : <>
        <View style={s.metricas}><View style={s.metrica}><Text style={s.muted}>Produtos</Text><Text style={s.numero}>{lista.length}</Text></View><View style={s.metrica}><Text style={s.muted}>Estoque baixo</Text><Text style={[s.numero,{color:baixos?c.red:c.navy}]}>{baixos}</Text></View></View>
        <Botao titulo="Atualizar lista" variante="secundario" onPress={atualizar} disabled={ocupado}/>
        <Text style={s.nomeGrande}>Produtos</Text>
        {carregado&&!lista.length&&!ocupado&&<View style={s.card}><Text style={s.nome}>Nenhum produto cadastrado</Text><Text style={s.muted}>Cadastre um produto no Angular e atualize a lista.</Text></View>}
        {lista.map(p=><Pressable accessibilityRole="button" disabled={ocupado} onPress={()=>abrir(p.id)} key={p.id} style={({pressed})=>[s.card,pressed&&{opacity:0.75}]}>
          <Text style={s.eyebrow}>{p.categoria}</Text><Text style={s.nome}>{p.nome}</Text><Text style={s.muted}>Saldo: {p.quantidade}  •  Mínimo: {p.estoqueMinimo}</Text><Status produto={p}/><Text style={s.link}>Ver detalhes ›</Text>
        </Pressable>)}
      </>}
      {ocupado&&<ActivityIndicator size="large" color={c.teal}/>}
      {!!msg&&<View accessibilityLiveRegion="polite" style={[s.mensagem,msg.erro?s.badgeBaixo:s.badgeOk]}><Text style={{color:msg.erro?c.red:c.teal,fontWeight:'700'}}>{msg.texto}</Text></View>}
      <Text style={s.rodape}>API: {API_URL}</Text>
    </ScrollView>
  </SafeAreaView>;
}
const s=StyleSheet.create({
  base:{flex:1,backgroundColor:c.bg,paddingTop:Platform.OS==='android'?StatusBar.currentHeight:0},
  area:{padding:20,gap:14,width:'100%',maxWidth:680,alignSelf:'center',paddingBottom:32},
  header:{paddingVertical:12,gap:5},eyebrow:{fontSize:12,fontWeight:'700',letterSpacing:1,color:c.teal},
  titulo:{fontSize:34,fontWeight:'800',color:c.navy},nomeGrande:{fontSize:23,fontWeight:'800',color:c.navy},nome:{fontSize:19,fontWeight:'700',color:c.navy},muted:{fontSize:14,color:c.muted},
  card:{backgroundColor:c.white,borderWidth:1,borderColor:c.border,borderRadius:16,padding:18,gap:11},
  metricas:{flexDirection:'row',gap:10},metrica:{flex:1,backgroundColor:c.white,padding:16,borderRadius:13,borderWidth:1,borderColor:c.border,gap:8},numero:{fontSize:28,fontWeight:'800',color:c.navy},
  badge:{alignSelf:'flex-start',paddingHorizontal:11,paddingVertical:7,borderRadius:8},badgeBaixo:{backgroundColor:'#FDE9DF'},badgeOk:{backgroundColor:'#DCF4EB'},
  botao:{backgroundColor:c.teal,padding:14,minHeight:48,borderRadius:10,justifyContent:'center',alignItems:'center'},secundario:{backgroundColor:c.white,borderWidth:1,borderColor:c.border},saida:{backgroundColor:c.red},botaoTexto:{color:c.white,fontWeight:'700',fontSize:15},
  input:{backgroundColor:c.bg,borderWidth:1,borderColor:c.border,borderRadius:10,padding:14,fontSize:18,color:c.navy},link:{color:c.teal,fontWeight:'700'},mensagem:{padding:15,borderRadius:10},rodape:{color:c.muted,fontSize:12,textAlign:'center',marginTop:8}
});
