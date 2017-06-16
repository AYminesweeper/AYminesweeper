<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>test</title>
</head>
<body>
<button id="insert">送信(insert)</button>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" charset="utf-8"></script>
	<script type="text/javascript">
		$( function() {
			$( '#insert' ) .click(
				function() {
					var hostUrl= '/insert';


					$.ajax({
						url: hostUrl,
						type:'POST',
						dataType: 'json',
						data : {"name" : "person1", "pos" : {"lat":10.00001, "long":10.00001}},
						//timeout:10000,
					}).done(function(data) {
						console.log("ok");
						console.log(data);
					}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
						alert("error");
					})
				});
		} );
	</script>

	<button id="update">送信(update)</button>
    <script src="https://code.jquery.com/jquery-2.2.4.min.js" charset="utf-8"></script>
	<script type="text/javascript">
		$( function() {
			$( '#update' ) .click(
				function() {
					var hostUrl= '/update';


					$.ajax({
						url: hostUrl,
						type:'POST',
						dataType: 'json',
						data : {"name" : "person1", "pos" : {"lat":22.2222, "long":22.2222}},
						//timeout:10000,
					}).done(function(data) {
						console.log("ok");
						console.log(data);
					}).fail(function(XMLHttpRequest, textStatus, errorThrown) {
						alert("error");
					})
				});
		} );
	</script>

</body>
</html>