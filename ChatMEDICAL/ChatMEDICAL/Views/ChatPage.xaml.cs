// ==============================
// ChatPage.xaml.cs (PATIENT SIDE)
// ==============================

using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;

namespace ChatMEDICAL.Views
{
    public sealed partial class ChatPage : Page
    {
        public ChatPage()
        {
            this.InitializeComponent();
        }

        protected override void OnNavigatedTo(Microsoft.UI.Xaml.Navigation.NavigationEventArgs e)
        {
            base.OnNavigatedTo(e);

            if (e.Parameter is string doctorName)
            {
                DoctorNameText.Text = doctorName;
            }
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(PatientDashboard));
        }

        private void Send_Click(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(MessageBox.Text))
                return;

            Border patientMessage = new Border
            {
                Background = new Microsoft.UI.Xaml.Media.SolidColorBrush(
                    Microsoft.UI.ColorHelper.FromArgb(255, 191, 233, 255)),
                CornerRadius = new CornerRadius(18),
                Padding = new Thickness(18),
                MaxWidth = 500,
                HorizontalAlignment = HorizontalAlignment.Right,
                Margin = new Thickness(0, 0, 0, 10)
            };

            StackPanel patientStack = new StackPanel();

            TextBlock patientText = new TextBlock
            {
                Text = MessageBox.Text,
                FontSize = 15,
                TextWrapping = TextWrapping.Wrap
            };

            TextBlock patientTime = new TextBlock
            {
                Text = DateTime.Now.ToString("HH:mm"),
                FontSize = 12,
                HorizontalAlignment = HorizontalAlignment.Right
            };

            patientStack.Children.Add(patientText);
            patientStack.Children.Add(patientTime);

            patientMessage.Child = patientStack;
            MessagesPanel.Children.Add(patientMessage);

            MessageBox.Text = "";
        }
    }
}