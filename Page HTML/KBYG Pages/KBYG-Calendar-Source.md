# Native calendar source embed

```text
<!-- Native Code Embed inside each Delegate/Sponsor Key Dates card.
     These are native Webflow field chips; retain their format when editing. -->
<span data-kbyg-all-day-local-date="{{wf:Use Local Date|Dynamo}}"
 data-kbyg-calendar-timezone="America/Toronto" hidden data-kbyg-calendar-source data-kbyg-start="{{wf:Calendar Start|Dynamo|DynamoGateway::dynamoDateTimeToText(>"YYYY-MM-DD H:mm")(Dynamo["calendar-start"])}}" data-kbyg-end="{{wf:Calendar End|Dynamo|DynamoGateway::dynamoDateTimeToText(>"YYYY-MM-DD H:mm")(Dynamo["calendar-end"])}}"></span>
```
