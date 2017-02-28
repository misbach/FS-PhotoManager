var fs = new FamilySearch({
  environment: 'production',
  appKey: 'a02j000000KTRjpAAH',
  redirectUri: 'https://misbach.github.io/FS-PhotoManager/',
  // redirectUri: 'http://localhost:5000/',
  saveAccessToken: true,
  tokenCookie: 'FS_AUTH_TOKEN'
});

// Begin oauth flow
$('.login').click(function() {
	fs.oauthRedirect();
});

// Finish oauth flow by obtaining access_token
fs.oauthResponse(function() {
	$('.photos').empty();

	// Get all photos for a user
	fs.get('/platform/users/current', function(error, response) {
		if (response.statusCode == 401) alert("You must login first");
		fs.user = response.data.users[0];

		// Get all the photos a user has uploaded
		fs.get('/platform/memories/users/'+fs.user.id+'/memories', function(error, response) {
			extractPhotos(response.data.sourceDescriptions, ".photos1");
		});

		// Get all the photos of ancestors
		fs.get('/platform/tree/ancestry/?person='+fs.user.personId+'&generations=5', function(error, response) {
			var photos = response.data.persons;

			// Get memories for each ancestor
			for (var i=0; i<photos.length; i++) {
				fs.get('/platform/tree/persons/'+photos[i].id+'/memories', function(error, response) {
					if (response.data) {
						extractPhotos(response.data.sourceDescriptions, ".photos2");
					}
				});
			}
		});

	});
});

// Extract photos from an array of memories
function extractPhotos (memories, location) {
	for (var i=0; i<memories.length; i++) {
		if (memories[i].mediaType.includes("image")) {
			var thumb = memories[i].about.replace("dist.jpg","thumb200s.jpg");
			thumb = thumb.replace("dist.png","thumb200s.jpg");
			var title = (memories[i].titles) ? memories[i].titles[0].value : "";
			var desc = (memories[i].descriptions) ? memories[i].descriptions[0].value : "";
			var url = "https://familysearch.org/photos/artifacts/"+memories[i].id;

			$(location).append('<li class="photo"><a href="'+url+'" class="link" target="_blank"><div><div class="title">'+title+'</div><img src="'+thumb+'"><div class="description">'+desc+'</div></div></a></li>');
		}
	}
}
