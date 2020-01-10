$(function(){
	/* binds */
	$('#search_suggest').on('click', 'li', function(ev){
		$('#txtSearch').val($(ev.target).html())
		window.location.href = 'https://'+ $('#l').val() +'.wikipedia.org/wiki/'+ escape($(ev.target).html());
	}).on('mouseenter', function(ev){
		isOver = true;
	}).on('mouseleave', function(){
		isOver = false;
		if (isBlur) {
			$('#search_suggest').hide().html('');
		}
	});
	$('#txtSearch').on('keyup', function(ev){
		var code = ev.keyCode || ev.which;
		if ($('#txtSearch').val().length > 0 && isKeyChar(code)){
			$.ajax({
				url: 'https://'+ $('#l').val() +'.wikipedia.org/w/api.php?action=opensearch&search='+ $('#txtSearch').val() +'',
				dataType: 'jsonp',
				success: function(data){
					var options = data[1], // 0 is the sent string. 1 is a list of options.
					list = [];
					if (options.length > 0 ){
						$.each(options, function(i, option){
							list.push('<li>'+ option +'</li>')
						})
					} else {
						list.push('<li class="no-option">'+ searchInLangs[$('#l').val()].noResult +'</li>')
					}
					$('#search_suggest').show().html(list.join(''))
					hoverBindForSuggestions()
				}
			});
		} else if ($('#search_suggest').is(':visible')){
			var $suggestions = $('#search_suggest'),
			$active = $suggestions.find('.active'),
			$lis = $suggestions.find('li');
			if (code === 38) { // up
				if ($lis.index($active) === 0) {
					$active.removeClass('active');
					$lis.last().addClass('active');
				} else {
					$active.removeClass('active').prev('li').addClass('active')
				}
				$('#txtSearch').val($suggestions.find('.active').html())
			} else if (code === 40) { // down
				if ($lis.index($active) === ($lis.length-1)) {
					$active.removeClass('active');
					$lis.first().addClass('active');
				} else if ($lis.index($active) === -1) {
					$lis.first().addClass('active');
				} else {
					$active.removeClass('active').next('li').addClass('active')
				}
				$('#txtSearch').val($suggestions.find('.active').html())
			}
		}
	}).on('focus', function(ev){
		isBlur = false;
	}).on('blur', function(ev){
		isBlur = true;
		if (!isOver) {
			$('#search_suggest').hide().html('');
		}
	});
	$('#langs a:not(.external)').on('click', function(ev){
		var $this = $(ev.target),
		lang = $this.data('lang-code');
		langSwap(lang);
	});
	/* functions */
	function langSwap(lang) {
		if (searchInLangs.hasOwnProperty(lang)) {
			$('#frmSearch').attr('action', 'http://'+lang+'.wikipedia.org/wiki/Special:Search');
			$('#l').val(lang);
			$('#cmdSearch').val(searchInLangs[lang].search);
			$('#searchtitle').text(searchInLangs[lang].head);
			if (window.location.hash !== '#'+ lang) {
				window.location.hash = lang;
			}
		} else {
			if (confirm('Invalid lang for this page. Do you wish to be sent to wikipedia.org?')) {
				window.location = 'http://wikipedia.org/';
			}
		}
	}
	function isKeyChar(code) {
		if (code == 32 || code == 8) {
			return true; // space or backspace
		} else if (code < 47 || (code > 112 && code < 47) ) {
			return false;
		} else {
			return true;
		}
	}
	function hoverBindForSuggestions(){
		$('#search_suggest li').off('mouseenter.suggesttion').on('mouseenter.suggesttion', function(ev){
			$(ev.target).addClass('active').siblings().removeClass('active');
		})
	}
	/* Setup */
	var	isOver = false;
	var isBlur = true;
	var searchInLangs = {
		'ar': {
			search: 'بحث',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på arabiska'
		},
		'bs': {
			search: 'Klask',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på bosniska'
		},
		'da': {
			search: 'Søg',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på danska'
		},
		'fi': {
			search: 'Haku',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på finska'
		},
		'ku': {
			search: 'Lêgerîn',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på kurdiska'
		},
		'no': {
			search: 'Søk',
			noResult: 'Inga resultat.',
			head: 'Norska Wikipedia'
		},
		'fa': {
			search: 'جستجو',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på persiska'
		},
		'se': {
			search: 'Oza',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på samiska'
		},
		'sr': {
			search: 'Претрага',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på serbiska'
		},
		'es': {
			search: 'Buscar',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på spanska'
		},
		'sv': {
			search: 'Sök',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på svenska'
		},
		'de': {
			search: 'Suche',
			noResult: 'Inga resultat.',
			head: 'Wikipedia på tyska'
		}
	}
	if (window.location.hash.length === 3 && window.location.hash.match(/#[a-z]{2}/g)) {
		langSwap(window.location.hash.match(/#([a-z]{2})/g)[0].replace('#',''))
	}
});
