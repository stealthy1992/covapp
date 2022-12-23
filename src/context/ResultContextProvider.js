import { createContext, useContext, useState } from 'react'

export const ResultContext = createContext()
const baseUrl = 'https://covid-19-statistics.p.rapidapi.com'

export const ResultContextProvider = ({children}) => {

    const [ results, setResults ] = useState([])
    const [ stats, setStats ] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)
    // const [ isStatsLoading, setIsStatsLoading ] = useState(false)

    const getResults = async (type) => {

        setIsLoading(true)
        const response = await fetch(`${baseUrl}${type}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd2f0d66c2dmshc841025c94cfa9bp16c747jsnd920a4c65066',
                'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
            }
        })

        const data = await response.json()
        setResults(data)
        setIsLoading(false)
    }

    const getStats = async (country) => {

        setIsLoading(true)
        setStats([])
        const response = await fetch(`${baseUrl}/reports?iso=${country}`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': 'd2f0d66c2dmshc841025c94cfa9bp16c747jsnd920a4c65066',
                'X-RapidAPI-Host': 'covid-19-statistics.p.rapidapi.com'
            }
        })

        const data = await response.json()
        // console.log(data)
        data?.data?.map(({confirmed, date, active, fatality_rate, deaths, region: {province}}) => {
            
                setStats(stats => [...stats, {
                    id: Math.random().toString(16).slice(2),
                    date: date,
                    province: province,
                    confirmed: confirmed,
                    active: active,
                    fatality_rate: fatality_rate,
                    deaths: deaths
                }])
            
        })
        // setStats(data.data)
        setIsLoading(false)

    }

    return (
        <ResultContext.Provider value={{getResults, results, getStats, stats, isLoading}}>
            {children}
        </ResultContext.Provider>
    )

}

export const useResultContext = () => useContext(ResultContext)