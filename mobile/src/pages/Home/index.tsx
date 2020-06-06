import React,{useCallback, useState, useEffect} from 'react';
import { ImageBackground,View,Text,Image, StyleSheet } from 'react-native';
import {Feather as Icon} from "@expo/vector-icons"
import {RectButton} from "react-native-gesture-handler"
import {useNavigation} from "@react-navigation/native"
import RNPickerSelect from 'react-native-picker-select';
import axios from "axios"


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
    backgroundColor: '#F0F0F5'
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  },
  selectInput: {
    height: 60,
    backgroundColor:"#eee",
    marginVertical: 8,

  }
});

interface UF {
  sigla: string
}

interface City {
  nome: string
}

const Home: React.FC = () => {

  const navigation = useNavigation()

  const [city, setCity] = useState<City[]>([])
  const [uf, setUf] = useState<UF[]>([])

  const [selectedUF, setSelectdUF] = useState("")
  const [selectedCity, setSelectdCity] = useState("")


  useEffect(() => {
    axios.get("https://servicodados.ibge.gov.br/api/v1/localidades/estados").then(response => {
      setUf(response.data)
    })

  }, [])

  const handleNavigateToPoints = useCallback(() => {

      const param = {
        uf: selectedUF,
        city: selectedCity
      }
    
    navigation.navigate("Points", param)
  },[selectedCity,selectedUF])


  const handleChangeUF = useCallback( (value : string) => {

    setSelectdUF(value)
   axios.get<City[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${value}/municipios`).then(response => {
    if(response) {
      setCity(response.data)
    }else {
      setCity([])
    }
   })

    
    
  }, [])

  return (
    <ImageBackground 
    source={require("../../assets/home-background.png")} 
    style={styles.container}
    imageStyle={{width: 274, height: 368}}
    >
      <View style={styles.main}> 
        <Image source={require("../../assets/logo.png")} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiênte.</Text>
        
      </View>

      <View style={styles.selectInput}> 
              <RNPickerSelect
              placeholder={{label: "Selecione uma UF"}}
              onValueChange={(value) => handleChangeUF(value)}
              items={uf.map(ufs => {
                return {
                  key: ufs.sigla,
                  label: ufs.sigla,
                  value: ufs.sigla
                }
              })}
            />
      </View>

      <View style={styles.selectInput}> 
              <RNPickerSelect
              placeholder={{label: "Selecione uma Cidade"}}
              onValueChange={(value) => setSelectdCity(value)}
              items={city.map(cities => {
                return {
                  key: cities.nome,
                  label: cities.nome,
                  value: cities.nome
                }
              })}
            />
      </View>

     <View style={styles.footer}>
        <RectButton style={styles.button} onPress={() => {}}>
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name={"arrow-right"} size={24} color="#fff"/>
            </Text>
          </View>
          <Text style={styles.buttonText} onPress={handleNavigateToPoints}>
            Entrar
          </Text>
        </RectButton>
     </View>
    </ImageBackground>
  );
}

export default Home;