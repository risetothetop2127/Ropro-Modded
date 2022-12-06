/**

RoPro (https://ropro.io) v1.5

The RoPro extension is developed by:
                               
,------.  ,--. ,-----.,------. 
|  .-.  \ |  |'  .--./|  .---' 
|  |  \  :|  ||  |    |  `--,  
|  '--'  /|  |'  '--'\|  `---. 
`-------' `--' `-----'`------' 
                            
Contact me:

Discord - Dice#1000
Email - dice@ropro.io
Phone - 650-318-1631

Write RoPro:

RoPro Software Corporation
999 Peachtree Street NE
Suite 400
Atlanta, GA 30309
United States

RoPro Terms of Service:
https://ropro.io/terms

RoPro Privacy Policy:
https://ropro.io/privacy-policy

© 2022 RoPro Software Corporation
**/

var assetId = null

function fetchUpcomingPage(page) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.ropro.io/getUpcomingPage.php?page=" + page}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function fetchWishlistAsset(assetId) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.ropro.io/getWishlistAsset.php?assetId=" + assetId + "&type=asset"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function setWishlistAsset(assetId, value) {
	return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "GetURL", url:"https://api.ropro.io/setWishlistAsset.php?assetId=" + assetId + "&value=" + value + "&type=asset"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function equipItem(assetId) {
    return new Promise(resolve => {
		chrome.runtime.sendMessage({greeting: "PostValidatedURL", url:"https://avatar.roblox.com/v1/avatar/assets/" + parseInt(assetId) + "/wear"}, 
			function(data) {
				resolve(data)
			}
		)
	})
}

function addCommas(nStr){
	nStr += '';
	var x = nStr.split('.');
	var x1 = x[0];
	var x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function addUpcomingCard(name, leakid, icon, discovered) {
    upcomingCardHTML = `<li class="list-item item-card"><a href="https://www.rolimons.com/leak/${parseInt(leakid)}" target="_blank" class="item-card-container" title="${stripTags(name)}">  <div class="item-card-link"> <div class="item-card-thumb-container"> <thumbnail-2d class="item-card-thumb ng-isolate-scope"><span class="thumbnail-2d-container"> <img alt="${stripTags(name)}" title="${stripTags(name)}" class="ng-scope ng-isolate-scope" src="${stripTags(icon)}">  </span> </thumbnail-2d>  </div> </div> <div class="item-card-caption ng-scope" ng-if="layout.isItemDetailsLoaded"> <div class="item-card-name-link"> <div class="item-card-name ng-binding" title="${stripTags(name)}">${stripTags(name)}</div> </div>   <div class="text-overflow item-card-price font-header-2 text-subheader ng-scope"><span style="margin-left:0px;" class="text-robux-tile ng-binding ng-scope"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" focusable="false" width="2.5em" height="2.5em" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg); transform:scale(0.5); display:inline-block;margin:-13px;margin-right:-8px;margin-bottom:-14px;" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M11 6h2v7h-2V6zM9 20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5l2-9h4v7a1 1 0 0 1-1 1v6zm1-15H7V3h3v2zm5 15v-6a1 1 0 0 1-1-1V6h4l2 9v5a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1zM14 5V3h3v2h-3z" fill="#7a8288"></path></svg>${stripTags(discovered)}</span></div> </div>  </a></li>`
    document.getElementById('upcomingItemResults').innerHTML += upcomingCardHTML
}

async function loadUpcomingPage(page) {
    upcoming = await fetchUpcomingPage(0)
    document.getElementById('upcomingItemResults').innerHTML = "";
    for (i = 0; i < upcoming.length; i++) {
        addUpcomingCard(upcoming[i].name, upcoming[i].leakid, upcoming[i].icon, upcoming[i].discovered)
    }
}

async function upcomingMain() {
    upcomingHTML = `<a class="small text menu-link text-link-secondary panel-heading" role="tab">  <span class="category-name ng-binding ng-scope">Upcoming Items</span> <span class="icon-plus toggle-submenu ng-hide"></span> </a> <div id="category-15" class="panel-collapse collapse ng-scope" accordion-menu="" use-secondary-icons="true" data-toggle="collapsible-element" role="tabpanel" data-expanded-icon="icon-minus" data-collapsed-icon="icon-plus"> <!-- ngIf: category.subcategories --><ul ng-if="category.subcategories" class="subcategory-menu ng-scope"> <!-- ngRepeat: subcategory in category.subcategories --> </ul><!-- end ngIf: category.subcategories --> </div>`
    upcomingResultsHTML = `<h3 class="featured-items-heading"> <span class="line-height">Upcoming Items</span>  <br><a href="https://www.rolimons.com" target="_blank"><p style="height:20px;" class="small text">Powered By <img style="margin-left:3px;width:15px;" src="${chrome.runtime.getURL('/images/rolimons_logo_icon_blue.png')}"> Rolimons.com</p></a></h3>  <div id="results" class="results-container">    <ul style="min-height:600px;" class="hlist item-cards-stackable ng-scope" id="upcomingItemResults" ng-if="isRegularItemsResultAvailable()" ng-class="{'faded' : layout.loading}"><span id="popularTodayLoading" style="margin-top:-100px;" class="spinner spinner-default"></span></ul>   </div> <!-- ngIf: showViewAllFeaturedItemsButton() --><div style="display:none;" class="pager-holder" cursor-pagination="pager" ng-show="paginations.isEnabled"><ul class="pager"> <li class="pager-prev disabled" ng-class="{ disabled: !cursorPaging.canLoadPreviousPage() }"> <a ng-click="cursorPaging.loadPreviousPage()"><span class="icon-back"></span></a> </li> <li> <span ng-bind="'Label.CurrentPage' | translate:{ currentPage: cursorPaging.getCurrentPageNumber() }" class="ng-binding">Page 1</span> </li> <li class="pager-next" ng-class="{ disabled: !cursorPaging.canLoadNextPage() }"> <a ng-click="cursorPaging.loadNextPage()"><span class="icon-next"></span></a> </li> </ul></div><!-- end ngIf: showViewAllFeaturedItemsButton() --> <div style="display:none;" class="pager-holder ng-hide" cursor-pagination="pager" ng-show="paginations.isEnabled"><ul class="pager"> <li class="pager-prev disabled" ng-class="{ disabled: !cursorPaging.canLoadPreviousPage() }"> <a ng-click="cursorPaging.loadPreviousPage()"><span class="icon-back"></span></a> </li> <li> <span ng-bind="'Label.CurrentPage' | translate:{ currentPage: cursorPaging.getCurrentPageNumber() }" class="ng-binding">Page 0</span> </li> <li class="pager-next disabled" ng-class="{ disabled: !cursorPaging.canLoadNextPage() }"> <a ng-click="cursorPaging.loadNextPage()"><span class="icon-next"></span></a> </li> </ul></div>`
    categoryPanel = document.getElementById('category-panel-group')
    if (categoryPanel != null) {
        categoryPanel = $(".category-section .panel-group").get(0)
        li = document.createElement('li')
        li.setAttribute("class", "font-header-2 text-subheader panel panel-default ng-scope")
        li.innerHTML += upcomingHTML
        categoryPanel.insertBefore(li, categoryPanel.getElementsByTagName('li')[0])
        $(".menu-link").click(function(){
            if ((this.getElementsByClassName('icon-plus').length == 0 && this.getElementsByClassName('icon-minus').length == 0) || (this.getElementsByClassName('icon-plus ng-hide').length > 0)) {
                if (this.innerHTML.includes("Upcoming Items")) {
                    console.log("Upcoming")
                    catalogResults = document.getElementsByClassName('catalog-results')[0]
                    if (catalogResults.style.display != "none") {
                        catalogResults.style.display = "none"
                        document.getElementsByClassName('search-container')[0].style.display = "none"
                        if (document.getElementById('upcomingDiv') == null) {
                            upcomingDiv = document.createElement('div')
                            upcomingDiv.setAttribute("id", "upcomingDiv")
                            upcomingDiv.setAttribute("class", "catalog-results")
                            upcomingDiv.innerHTML = upcomingResultsHTML
                            catalogResults.parentNode.appendChild(upcomingDiv)
                            loadUpcomingPage(0)
                        } else {
                            document.getElementById('upcomingDiv').style.display = "block"
                        }
                    }
                } else {
                    console.log("Other button")
                    catalogResults = document.getElementsByClassName('catalog-results')[0]
                    if (catalogResults.style.display == "none") {
                        catalogResults.style.display = "block"
                        document.getElementsByClassName('search-container')[0].style.display = "block"
                        if (document.getElementById('upcomingDiv') != null) {
                            document.getElementById('upcomingDiv').style.display = "none"
                        }
                    }
                }
            }
        })
    }
}

async function roproWishlistMain() {
    var div = document.createElement('div')
    div.innerHTML = `<li style="margin-top:10px;display: block;"><a class="btn-growth-md btn-secondary-md">RoPro Wishlist</a></li>`
    var button = div.childNodes[0]
    document.getElementById('search-options').getElementsByTagName('form')[0].appendChild(button)
    button.addEventListener('click', function() {
        alert("!")
    })
}

function addQuickEquip() {
    var div = document.createElement('div')
    div.innerHTML = `<a class="btn-control-md" title="Quick Item Equip" style="margin-top:-2.5px;margin-left:5px;width:30px;height:30px;"><span class="icon-plus" style="transform:scale(0.7);margin-left:-9px;margin-top:-9px;"></span></a>`
    var button = div.childNodes[0]
    document.getElementsByClassName('label-checkmark')[0].parentNode.appendChild(button)
    button.addEventListener('click', async function() {
        await equipItem(assetId)
        document.getElementsByClassName('alert-success')[0].innerText = "Quick Equipped Item with RoPro"
        document.getElementsByClassName('alert-success')[0].classList.add('on')
        setTimeout(function() {
            document.getElementsByClassName('alert-success')[0].classList.remove('on')
        }, 2000)
    })
}

function addWishlistToggle(wishlistAsset) {
    var container = document.getElementsByClassName('item-social-container')[0]
    var wishlistToggleHTML = `<li class="favorite-button-container" style="margin-left:10px;">
    <div class="tooltip-container" data-toggle="tooltip" title="" data-original-title="Add to Favorites">
        <a id="toggle-wishlist" style="position:relative;" class="${wishlistAsset['active'] ? 'wishlist-active' : ''}">
            <span title="${addCommas(parseInt(wishlistAsset['count']))}" value="${parseInt(wishlistAsset['count'])}" id="wishlistCount">${addCommas(parseInt(wishlistAsset['count']))}</span>
            <img id="wishlistInactive" src="chrome-extension://liiimjdcaghfmhdkombakadjkoiibehm/images/wishlist_inactive.png" style="margin-top:3px;width:17px;">
            <img id="wishlistActive" src="chrome-extension://liiimjdcaghfmhdkombakadjkoiibehm/images/wishlist_active.png" style="margin-top:3px;width:17px;">
            <div id="wishlistTooltip" style="position:absolute;background-color:#191B1D;padding:10px;width:310px;z-index:1000;text-align:center;border-radius:10px;left:-50px;top:30px;"><b id="wishlistToggleTitle">${wishlistAsset['active'] ? 'Remove from' : 'Add to'} RoPro Wishlist</b><p style="margin-top:2px;font-size:14px;">We'll send you a notification when items on your wishlist drop in price.</p></div>
        </a></div>
    </li>`
    var div = document.createElement('div')
    div.innerHTML = wishlistToggleHTML
    container.appendChild(div.childNodes[0])
    document.getElementById('toggle-wishlist').addEventListener('click', async function() {
        if (this.classList.contains('wishlist-active')) {
            var setWishlist = await setWishlistAsset(assetId, false)
            if (setWishlist['success']) {
                this.classList.remove('wishlist-active')
                document.getElementById('wishlistToggleTitle').innerText = "Add to RoPro Wishlist"
                var wishlistCount = parseInt(document.getElementById('wishlistCount').getAttribute('value'))
                document.getElementById('wishlistCount').setAttribute("value", wishlistCount - 1)
                document.getElementById('wishlistCount').setAttribute("title", addCommas(wishlistCount - 1))
                document.getElementById('wishlistCount').innerText = addCommas(wishlistCount - 1)
            }
        } else {
            var setWishlist = await setWishlistAsset(assetId, true)
            if (setWishlist['success']) {
                this.classList.add('wishlist-active')
                document.getElementById('wishlistToggleTitle').innerText = "Remove from RoPro Wishlist"
                var wishlistCount = parseInt(document.getElementById('wishlistCount').getAttribute('value'))
                document.getElementById('wishlistCount').setAttribute("value", wishlistCount + 1)
                document.getElementById('wishlistCount').setAttribute("title", addCommas(wishlistCount + 1))
                document.getElementById('wishlistCount').innerText = addCommas(wishlistCount + 1)
            }
        }
    })
}

window.onload = async function(){
    assetId = parseInt(window.location.href.split('catalog/')[1])
    if (!isNaN(assetId)) {
        if (await fetchSetting('quickEquipItem')) {
            if (document.getElementsByClassName('label-checkmark').length > 0) {
                addQuickEquip()
            }
        }
        /**if (await fetchSetting('roproWishlist')) {
            var wishlistAsset = await fetchWishlistAsset(assetId)
            if (wishlistAsset['valid']) {
                addWishlistToggle(wishlistAsset)
            }
        }**/
    } else {
        assetId = null
    }
    var checkCategories = setInterval(function(){
        if (document.getElementById('category-panel-group') != null && document.getElementById('category-panel-group').childNodes.length > 1) {
            clearInterval(checkCategories)
            upcomingMain()
            //roproWishlistMain()
        }
    }, 50)
}