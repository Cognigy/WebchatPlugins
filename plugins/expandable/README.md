# Expandable Plugin
This plugins allows showing a collapsed output that can be expanded.

## Usage
Send specially crafted message to the Webchat. You can use e.g. Code Node to form the message

## Message Data Structure
```json
 {
        "_plugin": {
                "type": "expandable",
                "text": "Your output here",
                "characterLimit": 150,
                "expandTitle": "Show More",
                "previewEnd": "... "
        }
}
```

## Settings
`text` defines the text output that should be split into preview and expansion, defaults to an empty text.
`characterLimit` defines the cutoff for the expandable text, defaults to 150. If the characterLimit is smaller than the text length, the previewEnd, button and expansion are not displayed.
`expandTitle` defines displayed title for the expansion button, defaults to "Show More".
`previewEnd` defines the characters displayed to indicate the end of the preview text, this will be removed once the expansion button is clicked, defaults to a single whitespace " ".

## CSS Customization
You can customize all elements with the following classes:
`expandableContainer` div that contains the whole message and can be restyled to look the same as other output messages
`expandableStart` the start of the text/the preview span
`expandablePreviewEnd` span with the separation characters between the start and the button
`expandableButton` span that displays the expansion and hides itself and the previewEnd once clicked
`expandableExpansion` span that includes the rest of the text
