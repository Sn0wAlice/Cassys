export class CountryRestriction {
    async getCountry(ip) {
        try{
            const country = await fetch(`http://www.geoplugin.net/json.gp?ip=${ip}`);
            return await country.json();
        } catch(err){
            console.log(err)
            return {geoplugin_countryName: 'Unknown'}
        }
    }
}