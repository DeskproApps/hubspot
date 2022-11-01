HubSpot App Setup
===

To install the HubSpot app you must first create an API token. Head over your HubSpot cloud account to get started.

Once you've logged in, click the gear/cog icon at the top right of the screen.

[![](/docs/assets/setup/hubspot-setup-01.png)](/docs/assets/setup/hubspot-setup-01.png)

Navigate to Account Setup > Integrations > Private Apps using the menu on the left.

[![](/docs/assets/setup/hubspot-setup-02.png)](/docs/assets/setup/hubspot-setup-02.png)

Click "Create a private app".

[![](/docs/assets/setup/hubspot-setup-03.png)](/docs/assets/setup/hubspot-setup-03.png)

Give the private app a name - this can be anything, something like "Deskpro App" will do.

[![](/docs/assets/setup/hubspot-setup-04.png)](/docs/assets/setup/hubspot-setup-04.png)

Click on the "Scopes" tab at the top of the screen and expand sections "CRM" and "Standard", selecting scopes (like on screenshots):

__CRM:__
* crm.objects.companies (__read__)
* crm.objects.contacts (__read__, __write__)
* crm.objects.deals (__read__, __write__)
* crm.objects.owners (__read__)

__Standard:__
* account-info.security.read
* oauth
* sales-email-read

[![](/docs/assets/setup/hubspot-setup-05.png)](/docs/assets/setup/hubspot-setup-05.png)
[![](/docs/assets/setup/hubspot-setup-06.png)](/docs/assets/setup/hubspot-setup-06.png)


Click "Create app" at the top right of the page and copy your new access token to your clipboard. **Keep this token private, safe and secure**.

[![](/docs/assets/setup/hubspot-setup-07.png)](/docs/assets/setup/hubspot-setup-07.png)

When you install the HubSpot app in Deskpro, enter this API token into the settings tab of the app. 

To configure who can see and use the HubSpot app, head to the "Permissions" tab and select those users and/or groups you'd like to have access.

When you're happy, click "Install".
