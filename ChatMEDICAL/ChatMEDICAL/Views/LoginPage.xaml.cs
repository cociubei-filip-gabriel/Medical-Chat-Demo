using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using ChatMEDICAL.Services;
using System;

namespace ChatMEDICAL.Views
{
    public sealed partial class LoginPage : Page
    {
        public LoginPage()
        {
            this.InitializeComponent();
        }

        private async void Login_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(EmailBox.Text) ||
                string.IsNullOrWhiteSpace(PasswordBox.Password))
            {
                ContentDialog dialog = new ContentDialog
                {
                    Title = "Login Error",
                    Content = "Please enter both Email and Password before logging in.",
                    CloseButtonText = "OK",
                    XamlRoot = this.XamlRoot
                };

                await dialog.ShowAsync();
                return;
            }

            try
            {
                var login = await MedicalApiClient.Shared.LoginAsync(EmailBox.Text, PasswordBox.Password);
                AppSession.PatientEmail = login?.Email ?? EmailBox.Text.Trim();
                Frame.Navigate(typeof(PatientDashboard));
            }
            catch (Exception ex)
            {
                ContentDialog dialog = new ContentDialog
                {
                    Title = "Login Error",
                    Content = $"Could not connect to the medical API. {ex.Message}",
                    CloseButtonText = "OK",
                    XamlRoot = this.XamlRoot
                };

                await dialog.ShowAsync();
            }
        }
        private void RequestAccess_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(RequestAccessPage));
        }
    }
}
