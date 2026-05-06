using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
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

            Frame.Navigate(typeof(PatientDashboard));
        }
        private void RequestAccess_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(RequestAccessPage));
        }
    }
}