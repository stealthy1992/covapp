import { createContext, useContext, useState } from 'react'

export const ProvinceStatsContext = createContext()

const baseUrl = 'https://covid-19-statistics.p.rapidapi.com'

export const ProvinceStatsContextProvider = ({children}) => {

    const [ provinceStats, setProvinceStats ] = useState([])
    const [ provinceStatsByDate, setProvinceStatsByDate ] = useState({})
    const [ isLoading, setIsLoading ] = useState(false)

    const getResultsByProvince = async (province) => {

        setIsLoading(true)
        const response = await fetch(`${baseUrl}/reports?region_province=${province}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd2f0d66c2dmshc841025c94cfa9bp16c747jsnd920a4c65066',
                'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
            }
        })

        const data = await response.json()
        setProvinceStats(data)
        setIsLoading(false)
    }

    const getResultByDate = async (province, date) => {
        
        console.log(date)
        setIsLoading(true)
        const response = await fetch(`${baseUrl}/reports?region_province=${province}&date=${date}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd2f0d66c2dmshc841025c94cfa9bp16c747jsnd920a4c65066',
                'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
            }
        })

        const data = await response.json()
        console.log(data)
        data?.data?.map(({active, active_diff, confirmed, confirmed_diff, deaths, deaths_diff, recovered, recovered_diff}) => {
            
            setProvinceStatsByDate( {
                previousActiveCases: active,
                todayActiveCases: active_diff,
                previousConfirmedCases: confirmed,
                todayConfirmedCases: confirmed_diff,
                previousDeaths: deaths,
                todayDeaths: deaths_diff,
                todayRecovered: recovered_diff,
                previousRecovered: recovered_diff

            })
        
        })
        setIsLoading(false)

    }

    return (
        <ProvinceStatsContext.Provider value={{isLoading, getResultByDate, getResultsByProvince, provinceStats, provinceStatsByDate}}>
            {children}
        </ProvinceStatsContext.Provider>
    )
}

export const useProvinceStatsContext = () => useContext(ProvinceStatsContext)