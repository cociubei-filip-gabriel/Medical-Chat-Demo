using Microsoft.UI.Xaml;
using Microsoft.UI.Xaml.Controls;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ChatMEDICAL.Views
{
    public sealed partial class PatientDashboard : Page
    {
        private Dictionary<string, List<string>> doctorsBySpecialty =
            new Dictionary<string, List<string>>()
        {
            {
                "Cardiology",
                new List<string>
                {
                    "Dr. Andrei Popescu",
                    "Dr. Maria Ionescu",
                    "Dr. Radu Georgescu"
                }
            },

            {
                "Dermatology",
                new List<string>
                {
                    "Dr. Elena Marinescu",
                    "Dr. Sorin Dumitrescu",
                    "Dr. Bianca Pavel"
                }
            },

            {
                "Orthopedics",
                new List<string>
                {
                    "Dr. Cristian Toma",
                    "Dr. Diana Stoica",
                    "Dr. Vlad Rusu"
                }
            },

            {
                "Neurology",
                new List<string>
                {
                    "Dr. Ana Preda",
                    "Dr. Mihai Enache",
                    "Dr. Roxana Ilie"
                }
            },

            {
                "Pediatrics",
                new List<string>
                {
                    "Dr. Laura Matei",
                    "Dr. George Pavel",
                    "Dr. Simona Dobre"
                }
            },

            {
                "Gynecology",
                new List<string>
                {
                    "Dr. Cristina Neagu",
                    "Dr. Ioana Petrescu",
                    "Dr. Daniel Mureșan"
                }
            },

            {
                "Ophthalmology",
                new List<string>
                {
                    "Dr. Irina Stan",
                    "Dr. Paul Tudor",
                    "Dr. Silvia Matei"
                }
            },

            {
                "ENT",
                new List<string>
                {
                    "Dr. Cătălin Pop",
                    "Dr. Roxana Filip",
                    "Dr. Adrian Luca"
                }
            },

            {
                "Urology",
                new List<string>
                {
                    "Dr. Mihnea Roman",
                    "Dr. Oana Iliescu",
                    "Dr. Victor Stan"
                }
            },

            {
                "Gastroenterology",
                new List<string>
                {
                    "Dr. Claudia Pavel",
                    "Dr. Tudor Enescu",
                    "Dr. Silvia Barbu"
                }
            },

            {
                "Endocrinology",
                new List<string>
                {
                    "Dr. Monica Sandu",
                    "Dr. Raluca Dima",
                    "Dr. Adrian Nistor"
                }
            },

            {
                "Pulmonology",
                new List<string>
                {
                    "Dr. George Muntean",
                    "Dr. Larisa Popa",
                    "Dr. Mihai Dobre"
                }
            },

            {
                "Psychiatry",
                new List<string>
                {
                    "Dr. Sorina Matei",
                    "Dr. Alin Georgescu",
                    "Dr. Bianca Rusu"
                }
            },

            {
                "Oncology",
                new List<string>
                {
                    "Dr. Andrada Neagu",
                    "Dr. Paul Marinescu",
                    "Dr. Ruxandra Pop"
                }
            },

            {
                "General Surgery",
                new List<string>
                {
                    "Dr. Cristian Pavel",
                    "Dr. Mihnea Ionescu",
                    "Dr. Vlad Dumitru"
                }
            },

            {
                "Plastic Surgery",
                new List<string>
                {
                    "Dr. Ioana Luca",
                    "Dr. Robert Stan",
                    "Dr. Diana Popescu"
                }
            },

            {
                "Rheumatology",
                new List<string>
                {
                    "Dr. Elena Tudor",
                    "Dr. Sorin Pavel",
                    "Dr. Carmen Matei"
                }
            },

            {
                "Nephrology",
                new List<string>
                {
                    "Dr. Monica Radu",
                    "Dr. George Ilie",
                    "Dr. Silvia Dobre"
                }
            },

            {
                "Infectious Diseases",
                new List<string>
                {
                    "Dr. Andreea Pop",
                    "Dr. Vlad Marin",
                    "Dr. Roxana Toma"
                }
            },

            {
                "Diabetology",
                new List<string>
                {
                    "Dr. Ana Ionescu",
                    "Dr. Mihai Luca",
                    "Dr. Bianca Stoica"
                }
            },

            {
                "Family Medicine",
                new List<string>
                {
                    "Dr. Elena Popa",
                    "Dr. Radu Pavel",
                    "Dr. Cristina Dinu"
                }
            }
        };

        public PatientDashboard()
        {
            this.InitializeComponent();
        }

        private void Back_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(LoginPage));
        }

        private void SpecialtyComboBox_SelectionChanged(
            object sender,
            SelectionChangedEventArgs e)
        {
            DoctorComboBox.Items.Clear();

            if (SpecialtyComboBox.SelectedItem is ComboBoxItem selectedItem)
            {
                string specialty = selectedItem.Content?.ToString() ?? "";

                if (doctorsBySpecialty.ContainsKey(specialty))
                {
                    foreach (var doctor in doctorsBySpecialty[specialty])
                    {
                        DoctorComboBox.Items.Add(
                            new ComboBoxItem
                            {
                                Content = doctor
                            });
                    }
                }
            }
        }

        private async void BookAppointment_Click(object sender, RoutedEventArgs e)
        {
            if (SpecialtyComboBox.SelectedItem == null)
            {
                await ShowError("Please select a medical specialty.");
                return;
            }

            if (DoctorComboBox.SelectedItem == null)
            {
                await ShowError("Please select a doctor.");
                return;
            }

            DateTime selectedDate = AppointmentDatePicker.Date.Date;

            if (selectedDate < DateTime.Today)
            {
                await ShowError("You cannot select a past date.");
                return;
            }

            ContentDialog dialog = new ContentDialog
            {
                Title = "Appointment Confirmed",
                Content = "Your appointment has been successfully booked. Your private doctor chat is now available.",
                CloseButtonText = "Open Chat",
                XamlRoot = this.XamlRoot
            };

            await dialog.ShowAsync();

            if (DoctorComboBox.SelectedItem is ComboBoxItem selectedDoctor)
            {
                string doctorName = selectedDoctor.Content?.ToString() ?? "Assigned Doctor";

                Frame.Navigate(typeof(ChatPage), doctorName);
            }
        }

        private async Task ShowError(string message)
        {
            ContentDialog dialog = new ContentDialog
            {
                Title = "Validation Error",
                Content = message,
                CloseButtonText = "OK",
                XamlRoot = this.XamlRoot
            };

            await dialog.ShowAsync();
        }
        private void Profile_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(ProfilePage));
        }

        private void Prescription_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(PrescriptionPage));
        }

        private void History_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(AppointmentHistoryPage));
        }

        private void UploadFiles_Click(object sender, RoutedEventArgs e)
        {
            Frame.Navigate(typeof(UploadMedicalFilesPage));
        }

        private void OpenChat_Click(object sender, RoutedEventArgs e)
        {
            if (DoctorComboBox.SelectedItem is ComboBoxItem selectedDoctor)
            {
                string doctorName = selectedDoctor.Content?.ToString() ?? "Assigned Doctor";
                Frame.Navigate(typeof(ChatPage), doctorName);
            }
            else
            {
                _ = ShowError("Please select a doctor first.");
            }
        }
    }
}
