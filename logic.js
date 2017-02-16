var fs = new FamilySearch({
  environment: 'production',
  appKey: 'a02j000000KTRjpAAH',
  redirectUri: 'https://misbach.github.io/FS-PhotoManager/',
  // redirectUri: 'http://localhost:5000/',
  saveAccessToken: true,
  tokenCookie: 'FS_AUTH_TOKEN'
});

// Finish oauth flow by obtaining access_token
fs.oauthResponse( function() {
	window.location.replace(window.location.href.split("?code=")[0]);
});

// Begin oauth flow
$('.login').click(function() {
	fs.oauthRedirect();
});

// Import photos from FamilySearch
$('.import').click(function() {
	$('.photos').empty();
	// Get current user info
	fs.get('/platform/users/current', function(error, response) {
		if (response.statusCode == 401) alert("You must login first");
		fs.user = response.data.users[0];

		// Get user photos
		fs.get('/platform/memories/users/'+fs.user.id+'/memories', function(error, response) {
			var photos = response.data.sourceDescriptions;
			for (var i=0; i<photos.length; i++) {
				if (photos[i].mediaType.includes("image")) {
					// console.log(photos[i]);

					if (photos[i].about.indexOf("TH-232-35647-9-77") > 0) console.log(photos[i]);

					var thumb = photos[i].about.replace("dist.jpg","thumb200s.jpg");
					thumb = thumb.replace("dist.png","thumb200s.jpg");
					var title = (photos[i].titles) ? photos[i].titles[0].value : "";
					var desc = (photos[i].descriptions) ? photos[i].descriptions[0].value : "";
					var url = "https://familysearch.org/photos/artifacts/"+photos[i].id;

					$('.photos').append('<li class="photo"><a href="'+url+'" class="link" target="_blank"><div><div class="title">'+title+'</div><img src="'+thumb+'"><div class="description">'+desc+'</div></div></a></li>');
				}
			}
		});

	});
});