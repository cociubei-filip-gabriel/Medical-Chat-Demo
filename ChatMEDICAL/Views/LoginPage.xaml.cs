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

                if (login is null)
                {
                    await ShowLoginError("Invalid login response from API.");
                    return;
                }

                AppSession.UserId = login.UserId;
                AppSession.Email = login.Email;
                AppSession.DisplayName = login.DisplayName;
                AppSession.Role = login.Role;

                if (login.Role.Equals("doctor", StringComparison.OrdinalIgnoreCase))
                {
                    Frame.Navigate(typeof(DoctorAppointmentsPage));
                }
                else if (login.Role.Equals("admin", StringComparison.OrdinalIgnoreCase))
                {
                    Frame.Navigate(typeof(AdminDashboardPage));
                }
                else
                {
                    Frame.Navigate(typeof(PatientDashboard));
                }
            }
            catch (Exception ex)
            {
                await ShowLoginError($"Could not connect to the medical API. {ex.Message}");
            }
        }

        private async System.Threading.Tasks.Task ShowLoginError(string message)
        {
            ContentDialog dialog = new ContentDialog
            {
                Title = "Login Error",
                Content = message,
                CloseButtonText = "OK",
                XamlRoot = this.XamlRoot
            };

            await dialog.ShowAsync();
        }
        private void RequestAccess_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(RequestAccessPage));
        }
    }
}
