###############################################################################
# Dropdown menu
###############################################################################
"use strict"

( ($) ->
    class window.DrmDropdownMenu
        constructor: (@menu = $('ul.drm-dropdown-nav'), @speed = 1000) ->
            self = @
            @listItem = @menu.find 'li:has(ul)'

            hideMenu = ->
                self.hideMenu.call @, self.speed

            @listItem.on 'mouseenter', @showMenu
            @listItem.on 'mouseleave', hideMenu       

            @listItem.children('a').on 'click', (e) ->
                e.preventDefault()

        showMenu: ->
            $(@).children('ul').fadeIn 300
        
        hideMenu: (speed) ->
            $(@).children('ul').fadeOut speed

    return

) jQuery