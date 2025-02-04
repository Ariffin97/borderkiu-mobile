const BASE_URL = 'https://www.borderkiu.com/'

export const getQueueTime = async (border: string, direction:string) => {
    try {
        const response = await fetch(`${BASE_URL}/api/queuetimes${border}`,
            {
                method: 'GET'
            }
        )
        return response
    } catch (error) {
        
    }
}