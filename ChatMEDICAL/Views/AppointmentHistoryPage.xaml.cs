using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using ChatMEDICAL.Services;
using System;

namespace ChatMEDICAL.Views
{
    public sealed partial class AppointmentHistoryPage : Page
    {
        public AppointmentHistoryPage()
        {
            this.InitializeComponent();
            Loaded += AppointmentHistoryPage_Loaded;
        }

        private async void AppointmentHistoryPage_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                var appointments = await MedicalApiClient.Shared.GetAppointmentsAsync(patientEmail: AppSession.PatientEmail);
                HistoryListView.ItemsSource = appointments;
                StatusText.Text = $"{appointments.Count} appointments loaded from database.";
            }
            catch (Exception ex)
            {
                StatusText.Text = $"Could not load appointment history: {ex.Message}";
            }
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(PatientDashboard));
        }
    }
}
