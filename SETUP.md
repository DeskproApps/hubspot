HubSpot App Setup
===

To install the HubSpot app, you need to retrieve authentication credentials using either a Private API Token or OAuth. Follow the steps below for your preferred method.

## Using An API Token

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
* files
* oauth
* sales-email-read

[![](/docs/assets/setup/hubspot-setup-05.png)](/docs/assets/setup/hubspot-setup-05.png)
[![](/docs/assets/setup/hubspot-setup-06.png)](/docs/assets/setup/hubspot-setup-06.png)


Click "Create app" at the top right of the page and copy your new access token to your clipboard. **Keep this token private, safe and secure**.

[![](/docs/assets/setup/hubspot-setup-07.png)](/docs/assets/setup/hubspot-setup-07.png)

When you install the HubSpot app in Deskpro, enter this API token into the settings tab of the app. 

To configure who can see and use the HubSpot app, head to the "Permissions" tab and select those users and/or groups you'd like to have access.

When you're happy, click "Install".


## Using OAuth

Head over to [HubSpot Developers](https://developers.hubspot.com/) and log into your HubSpot developer account. Click **"Go to my account"** in the top-right corner and select the account you would like to use.

[![](/docs/assets/setup/hubspot-setup-oauth-01.png)](/docs/assets/setup/hubspot-setup-oauth-01.png)

On the developer homepage, click **"Create app"**. In the **Apps** page, click **"Create app"** again.

[![](/docs/assets/setup/hubspot-setup-oauth-02.png)](/docs/assets/setup/hubspot-setup-oauth-02.png)

In the **App Info** tab, give your app a name, something like "Deskpro App" will work.

[![](/docs/assets/setup/hubspot-setup-oauth-03.png)](/docs/assets/setup/hubspot-setup-oauth-03.png)

Next, go to the **"Auth"** tab and input the **Callback URL** from the Deskpro admin settings drawer into the `Redirect URLs` field.

[![](/docs/assets/setup/hubspot-setup-oauth-04.png)](/docs/assets/setup/hubspot-setup-oauth-04.png)

In the same tab, click **"Add new scope"**, select the following scopes, and click **"Update"**:

- account-info.security.read
- crm.objects.companies.read
- crm.objects.contacts.read
- crm.objects.contacts.write
- crm.objects.deals.read
- crm.objects.deals.write
- crm.objects.owners.read
- files
- oauth
- sales-email-read

Once you're done, click the **"Create app"** button at the bottom of the screen. Then, go back to the **"Auth"** tab and copy your **Client ID** and **Client Secret** into Deskpro.

[![](/docs/assets/setup/hubspot-setup-oauth-05.png)](/docs/assets/setup/hubspot-setup-oauth-05.png)

To configure who can access the app, go to the **Permissions** tab and select the users and/or groups that should have access. Once you're satisfied with the settings, click **"Install"** to complete the setup.