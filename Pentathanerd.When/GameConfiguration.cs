﻿using System;
using System.Configuration;

namespace Pentathanerd.When
{
    internal static class GameConfiguration
    {
        private const int DefaultAverageCharactersPerMinute = 195;
        private const int DefaultAvailableScoreBeforeBonus = 1200;
        private const int DefaultLowerBoundTurnTimeInSeconds = 2;
        private const int DefaultUpperBoundTurnTimeInSeconds = 6;
        private const int DefaultKeyPressThresholdPerTurn = 5;
        private const string DefaultDefaultTeamName = "NoNameGang";

        public static int AverageCharactersPerMinute
        {
            get
            {
                var appSetting = GetAppSetting("AverageCharactersPerMinute");
                return string.IsNullOrEmpty(appSetting) ? DefaultAverageCharactersPerMinute : Convert.ToInt32(appSetting);
            }
        }

        public static int AvailableScoreBeforeBonus
        {
            get
            {
                var appSetting = GetAppSetting("AvailableScoreBeforeBonus"); 
                return string.IsNullOrEmpty(appSetting) ? DefaultAvailableScoreBeforeBonus : Convert.ToInt32(appSetting);
            }
        }

        public static int LowerBoundTurnTimeInSeconds
        {
            get
            {
                var appSetting = GetAppSetting("LowerBoundTurnTimeInSeconds");
                return string.IsNullOrEmpty(appSetting) ? DefaultLowerBoundTurnTimeInSeconds : Convert.ToInt32(appSetting);
            }
        }

        public static int UpperBoundTurnTimeInSeconds
        {
            get
            {
                var appSetting = GetAppSetting("UpperBoundTurnTimeInSeconds");
                return string.IsNullOrEmpty(appSetting) ? DefaultUpperBoundTurnTimeInSeconds : Convert.ToInt32(appSetting);
            }
        }

        public static int KeyPressThresholdPerTurn
        {
            get
            {
                var appSetting = GetAppSetting("KeyPressThresholdPerTurn");
                return string.IsNullOrEmpty(appSetting) ? DefaultKeyPressThresholdPerTurn : Convert.ToInt32(appSetting);
            }
        }

        public static string DefaultTeamName
        {
            get
            {
                var appSetting = GetAppSetting("DefaultTeamName");
                return string.IsNullOrEmpty(appSetting) ? DefaultDefaultTeamName : appSetting;
            }
        }

        private static string GetAppSetting(string settingName)
        {
            string retValue = null;
            if (ConfigurationManager.AppSettings[settingName] != null)
            {
                retValue = ConfigurationManager.AppSettings[settingName];
            }
            return retValue;
        }
    }
}