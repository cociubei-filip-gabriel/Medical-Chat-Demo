using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using ChatMEDICAL.Services;
using System;

namespace ChatMEDICAL.Views
{
    public sealed partial class RequestAccessPage : Page
    {
        public RequestAccessPage()
        {
            this.InitializeComponent();
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(LoginPage));
        }

        private async void SubmitRequest_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(FullNameBox.Text) ||
                string.IsNullOrWhiteSpace(CnpBox.Text) ||
                string.IsNullOrWhiteSpace(EmailBox.Text) ||
                string.IsNullOrWhiteSpace(PhoneBox.Text) ||
                string.IsNullOrWhiteSpace(PasswordBox.Password))
            {
                await ShowDialog("Validation Error", "Please complete all required fields.");
                return;
            }

            if (PasswordBox.Password != ConfirmPasswordBox.Password)
            {
                await ShowDialog("Validation Error", "Passwords do not match.");
                return;
            }

            try
            {
                await MedicalApiClient.Shared.RegisterPatientAsync(
                    FullNameBox.Text,
                    CnpBox.Text,
                    EmailBox.Text,
                    PhoneBox.Text,
                    PasswordBox.Password);

                await ShowDialog("Account Created", "Your patient account has been created. You can now login.");
                Frame.Navigate(typeof(LoginPage));
            }
            catch (Exception ex)
            {
                await ShowDialog("Registration Error", $"Could not create the account. {ex.Message}");
            }
        }

        private async System.Threading.Tasks.Task ShowDialog(string title, string message)
        {
            ContentDialog dialog = new ContentDialog
            {
                Title = title,
                Content = message,
                CloseButtonText = "OK",
                XamlRoot = this.XamlRoot
            };

            await dialog.ShowAsync();
        }
    }
}
