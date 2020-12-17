
;(function( $ ){
	var URI = location.href.replace(/#.*/,'');

	var $localScroll = $.localScroll = function( settings ){
		$('body').localScroll( settings );
	};

	
	$localScroll.defaults = {
		duration:1000, 
		axis:'y',
		event:'click',
		stop:true
	};

	
	$localScroll.hash = function( settings ){
		settings = $.extend( {}, $localScroll.defaults, settings );
		settings.hash = false;
		if( location.hash )
			setTimeout(function(){ scroll( 0, location, settings ); }, 0 );

	$.fn.localScroll = function( settings ){
		settings = $.extend( {}, $localScroll.defaults, settings );

		return ( settings.persistent || settings.lazy ) 
				? this.bind( settings.event, function( e ){
					var a = $([e.target, e.target.parentNode]).filter(filter)[0];
					a && scroll( e, a, settings );
				})
				: this.find('a')
						.filter( filter ).bind( settings.event, function(e){
							scroll( e, this, settings );
						}).end()
					.end();

		function filter(){
			return !!this.href && !!this.hash && this.href.replace(this.hash,'') == URI && (!settings.filter || $(this).is( settings.filter ));
		};
	};

	function scroll( e, link, settings ){
		var id = link.hash.slice(1),
			elem = document.getElementById(id) || document.getElementsByName(id)[0];
		if ( elem ){
			e && e.preventDefault();
			var $target = $( settings.target || $.scrollTo.window() );

			if( settings.lock && $target.is(':animated') ||
			settings.onBefore && settings.onBefore.call(link, e, elem, $target) === false ) return;

			if( settings.stop )
				$target.queue('fx',[]).stop();

			$target
				.scrollTo( elem, settings )
				.trigger('notify.serialScroll',[elem]);
			if( settings.hash )
				$target.queue(function(){
					location = link.hash;
				});
		}
	};

})( jQuery );