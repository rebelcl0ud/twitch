const clientID = 'aoduqmn77opdqjxy9aqirf976btdpk'; // can be public

const usersWatching = 
	fetch('https://api.twitch.tv/helix/users?login=relaxbeats&login=freecodecamp&login=funfunfunction&login=anathug_&login=24_7_chill_piano', { 
		headers: {  
			'Client-ID': clientID 
		} 
	});

const streamingNow = 
	fetch('https://api.twitch.tv/helix/streams?user_login=relaxbeats&user_login=freecodecamp&user_login=funfunfunction&user_login=anathug_&user_login=24_7_chill_piano', { 
		headers: {  
			'Client-ID': clientID 
		} 
	});

Promise
	.all([usersWatching, streamingNow])
	.then(responses => {
		return Promise.all(responses.map(res => res.json()));
	})
	.then(responses => {
		let userDeets = [];
		let streamerID = [];
		let addDeets = '';
		responses.map(response => {
			// console.log(response)
			response.data.forEach(res => {
				if(res.type === 'live') {
					// console.log(res)
					streamerID.push(res.user_id);

					addDeets += `    
            <br /><br />
              ${res.title}
            <br /><br />
              language: ${res.language} 
            <br /> 
              views: ${res.viewer_count}
            <br />`;
				}
				else {
					userDeets.push(res);
				}
			});
		});

		const url = 'https://www.twitch.tv/';
		let watchList = ''; 
		let nowStreaming = '';
		for(let i=0; i < userDeets.length; i++) {
			let {display_name: name, description, profile_image_url: img, id} = userDeets[i];
			// console.log(name, description, img, id)
			if(streamerID.includes(id)) {
				// watchList
				watchList += `
				<div class="watch watch--stream">
				  <a href="${url}${name}">${name}</a> is LIVE 📺
				</div>
				<br />`;

				nowStreaming += `
				<div class="chan chan--box">
				  <a href="${url}${name}"><img src="${img}"></a>
				  <span class="chan chan-text">
				    <a href="${url}${name}">${name}</a> | ${description}
				  </span>
				</div>
				<br />`;
			} else {
				watchList += `
				<div class="watch watch--stream" style="font-style: italic; opacity: 0.5">
				  <a href="${url}${name}">${name}</a> seems to be offline ¯|_(ツ)_/¯
				</div>
				<br />`; 
			}
		} // for-loop
		$('.watch').html(watchList);
		$('.streams').html(nowStreaming);
		// $('.chan-text').append(addDeets); 
	}); // then 
