using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using ChatMEDICAL.Services;
using System;
using System.Threading.Tasks;

namespace ChatMEDICAL.Views
{
    public sealed partial class DoctorAppointmentsPage : Page
    {
        public DoctorAppointmentsPage()
        {
            this.InitializeComponent();
            Loaded += DoctorAppointmentsPage_Loaded;
        }

        private async void DoctorAppointmentsPage_Loaded(object sender, RoutedEventArgs e)
        {
            DoctorInfoText.Text = $"Logged in as {AppSession.DisplayName} ({AppSession.Email})";
            await LoadAppointmentsAsync();
        }

        private async void Refresh_Click(object sender, RoutedEventArgs e)
        {
            await LoadAppointmentsAsync();
        }

        private async Task LoadAppointmentsAsync()
        {
            try
            {
                var appointments = await MedicalApiClient.Shared.GetAppointmentsAsync(doctorEmail: AppSession.Email);
                AppointmentsListView.ItemsSource = appointments;
                StatusText.Text = $"{appointments.Count} appointments loaded from database.";
            }
            catch (Exception ex)
            {
                StatusText.Text = $"Could not load appointments: {ex.Message}";
            }
        }

        private async void Confirm_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && Guid.TryParse(button.Tag?.ToString(), out Guid appointmentId))
            {
                try
                {
                    await MedicalApiClient.Shared.ConfirmAppointmentAsync(appointmentId);
                    await LoadAppointmentsAsync();
                }
                catch (Exception ex)
                {
                    await ShowDialog("Error", $"Could not confirm appointment. {ex.Message}");
                }
            }
        }

        private async void Cancel_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && Guid.TryParse(button.Tag?.ToString(), out Guid appointmentId))
            {
                try
                {
                    await MedicalApiClient.Shared.CancelAppointmentAsync(appointmentId);
                    await LoadAppointmentsAsync();
                }
                catch (Exception ex)
                {
                    await ShowDialog("Error", $"Could not cancel appointment. {ex.Message}");
                }
            }
        }

        private void Logout_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(LoginPage));
        }

        private async Task ShowDialog(string title, string message)
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
