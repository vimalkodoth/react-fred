import axios from 'axios';
import config from '../config/config';

function getObservationsBySeriesId(seriesId, startTime, endTime, optionParams){
	startTime = startTime || '1999-08-14';
	endTime = endTime || '2019-08-13';
	var optionals = config['API_OPTIONAL_PARAMS'][seriesId];
	let url = `/fred/series/observations?file_type=json&api_key=${config.API_KEY}&series_id=${seriesId}&observation_start=${startTime}&observation_end=${endTime}`;
	if(optionals){
		for(var param in optionals){
			url += '&'+param+'='+optionals[param];
		}
	}
  	return axios.get(url).then(response => response.data);
}

export { getObservationsBySeriesId }