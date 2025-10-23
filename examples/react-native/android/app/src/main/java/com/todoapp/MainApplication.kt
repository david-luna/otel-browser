package com.todoapp

import android.app.Application
import co.elastic.otel.android.ElasticApmAgent
import co.elastic.otel.android.api.ElasticOtelAgent
import co.elastic.otel.android.extensions.log
import co.elastic.otel.android.extensions.span
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {
  companion object {
      internal lateinit var agent: ElasticOtelAgent
  }

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList =
        PackageList(this).packages.apply {
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // add(MyReactNativePackage())
        },
    )
  }

  override fun onCreate() {
    super.onCreate()
    // Initializing EDOT Android
    agent = ElasticApmAgent.builder(this)
      .setServiceName("My app name")
      .setExportUrl("http://10.0.2.2:4318")
      .build()

    // Creating data for testing purposes
    agent.span("Creating android app") {
      agent.log("Log during android app creation")
    }

    loadReactNative(this)
  }
}
