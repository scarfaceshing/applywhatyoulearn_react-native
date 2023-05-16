package com.awylreactnative

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.widget.RemoteViews;
import android.content.SharedPreferences;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Implementation of App Widget functionality.
 */
class AWYLReactNatiiveWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        // There may be multiple widgets active, so update all of them
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onEnabled(context: Context) {
        // Enter relevant functionality for when the first widget is created
    }

    override fun onDisabled(context: Context) {
        // Enter relevant functionality for when the last widget is disabled
    }
}

internal fun updateAppWidget(
    context: Context,
    appWidgetManager: AppWidgetManager,
    appWidgetId: Int
) {
    try {
        val sharedPref: SharedPreferences =
            context.getSharedPreferences("DATA", Context.MODE_PRIVATE)
        val appString: String? = sharedPref.getString("appData", "{\"text\":'no data'}")
        val appData = JSONObject(appString)
        val views = RemoteViews(context.packageName, R.layout.a_w_y_l_react_natiive_widget)
        views.setTextViewText(R.id.appwidget_text, appData.getString("text"))
        appWidgetManager.updateAppWidget(appWidgetId, views)
    } catch (e: JSONException) {
        e.printStackTrace()
    }
}