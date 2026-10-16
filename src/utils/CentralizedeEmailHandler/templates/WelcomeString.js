export function WelcomeEmailTempate(email,password,name,course){
   const strings = `
    <html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
  lang="en"
  >
  <head>
    <title></title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <link
      href="https://fonts.googleapis.com/css?family=Montserrat"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css?family=Open+Sans"
      rel="stylesheet"
      type="text/css"
    />
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        padding: 0;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: inherit !important;
      }

      #MessageViewBody a {
        color: inherit;
        text-decoration: none;
      }

      p {
        line-height: inherit;
      }

      .desktop_hide,
      .desktop_hide table {
        mso-hide: all;
        display: none;
        max-height: 0;
        overflow: hidden;
      }

      .image_block img + div {
        display: none;
      }

      @media (max-width: 720px) {
        .social_block.desktop_hide .social-table {
          display: inline-block !important;
        }

        .row-content {
          width: 100% !important;
        }

        .mobile_hide {
          display: none;
        }

        .stack .column {
          width: 100%;
          display: block;
        }

        .mobile_hide {
          min-height: 0;
          max-height: 0;
          max-width: 0;
          overflow: hidden;
          font-size: 0;
        }

        .desktop_hide,
        .desktop_hide table {
          display: table !important;
          max-height: none !important;
        }
      }
    </style>
  </head>
  <body
    style="
      margin: 0;
      background-color: #fff;
      padding: 0;
      -webkit-text-size-adjust: none;
      text-size-adjust: none;
    "
  >
    <table
      class="nl-container"
      width="100%"
      border="0"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      style="mso-table-lspace: 0; mso-table-rspace: 0; background-color: #fff"
    >
      <tbody>
        <tr>
          <td>
            <table
              class="row row-1"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #fff;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <div
                              class="spacer_block block-1"
                              style="
                                height: 30px;
                                line-height: 30px;
                                font-size: 1px;
                              "
                            >
                              &#8202;
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-2"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="mso-table-lspace: 0; mso-table-rspace: 0"
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        color: #333;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="50%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 10px;
                              padding-left: 20px;
                              padding-right: 20px;
                              padding-top: 10px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="image_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="mso-table-lspace: 0; mso-table-rspace: 0"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0;
                                    padding-left: 0;
                                  "
                                >
                                  <div
                                    class="alignment"
                                    align="left"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      src="https://eflow-backend-19sg.onrender.com/main/project.emernlogo.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 155px;
                                        max-width: 100%;
                                      "
                                      width="155"
                                      alt="Image"
                                      title="Image"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-2"
                            width="50%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="paragraph_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 10px;
                                    padding-left: 10px;
                                    padding-right: 10px;
                                    padding-top: 20px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #e3e3e3;
                                      font-family: Open Sans, Helvetica Neue,
                                        Helvetica, Arial, sans-serif;
                                      font-size: 15px;
                                      line-height: 120%;
                                      text-align: right;
                                      mso-line-height-alt: 14.399999999999999px;
                                    "
                                  >
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      <span
                                        >Transforming Education for the Digital
                                        Age</span
                                      >
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-3"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #fff;
                background-image: url(https://d1oco4z2z1fhwp.cloudfront.net/templates/default/286/Bg_text_ani.gif);
                background-position: top center;
                background-repeat: no-repeat;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 40px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="image_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="mso-table-lspace: 0; mso-table-rspace: 0"
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0;
                                    padding-left: 0;
                                  "
                                >
                                  <div
                                    class="alignment"
                                    align="right"
                                    style="line-height: 10px"
                                  >
                                    <img
                                      src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/286/iPhone_1.png"
                                      style="
                                        display: block;
                                        height: auto;
                                        border: 0;
                                        width: 350px;
                                        max-width: 100%;
                                      "
                                      width="350"
                                      alt="Image"
                                      title="Image"
                                    />
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-4"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #f4f4f4;
                background-image: url(https://d1oco4z2z1fhwp.cloudfront.net/templates/default/286/bg_wave_1.png);
                background-position: top center;
                background-repeat: repeat;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <div
                              class="spacer_block block-1"
                              style="
                                height: 90px;
                                line-height: 90px;
                                font-size: 1px;
                              "
                            >
                              &#8202;
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-5"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #f4f4f4;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="paragraph_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-left: 30px;
                                    padding-right: 30px;
                                    padding-top: 10px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #555;
                                      font-family: Montserrat, 'Trebuchet MS',
                                        'Lucida Grande', 'Lucida Sans Unicode',
                                        'Lucida Sans', Tahoma, sans-serif;
                                      font-size: 46px;
                                      line-height: 120%;
                                      text-align: left;
                                      mso-line-height-alt: 55.199999999999996px;
                                    "
                                  >
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      <strong>
                                        <span>
                                          Welcome ,
                                          <span style="color: rgb(61, 59, 238)"
                                            >${name}</span
                                          >
                                          !
                                        </span>
                                      </strong>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>

                            <table
                              class="paragraph_block block-2"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 5px;
                                    padding-left: 30px;
                                    padding-right: 30px;
                                    padding-top: 15px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #555;
                                      font-family: Open Sans, Helvetica Neue,
                                        Helvetica, Arial, sans-serif;
                                      font-size: 20px;
                                      line-height: 150%;
                                      text-align: left;
                                      mso-line-height-alt: 30px;
                                    "
                                  >
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      <strong>
                                        <span
                                          >Welcome to Our Learning Management
                                          System!</span
                                        >
                                      </strong>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="paragraph_block block-3"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-left: 30px;
                                    padding-right: 30px;
                                    padding-top: 15px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #7c7c7c;
                                      font-family: Open Sans, Helvetica Neue,
                                        Helvetica, Arial, sans-serif;
                                      font-size: 16px;
                                      line-height: 150%;
                                      text-align: left;
                                      mso-line-height-alt: 24px;
                                    "
                                  >
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      <span
                                        >Manage your institution effortlessly
                                        with our comprehensive eflow
                                        solution.&nbsp;Transform the way you
                                        handle administrative tasks and student
                                        interactions with ease.
                                      </span>
                                    </p>
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      <span>Here’s what we offer:</span>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="paragraph_block block-4"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 20px;
                                    padding-left: 30px;
                                    padding-right: 30px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #7c7c7c;
                                      font-family: Open Sans, Helvetica Neue,
                                        Helvetica, Arial, sans-serif;
                                      font-size: 12px;
                                      line-height: 150%;
                                      text-align: left;
                                      mso-line-height-alt: 18px;
                                    "
                                  >
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      &nbsp;
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-6"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #f4f4f4;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        background-color: #fff;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-left: 5px;
                              padding-right: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="paragraph_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-left: 35px;
                                    padding-right: 10px;
                                    padding-top: 25px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #444;
                                      font-family: Montserrat, 'Trebuchet MS',
                                        'Lucida Grande', 'Lucida Sans Unicode',
                                        'Lucida Sans', Tahoma, sans-serif;
                                      font-size: 24px;
                                      line-height: 120%;
                                      text-align: left;
                                      mso-line-height-alt: 28.799999999999997px;
                                    "
                                  >
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      <span
                                        style="
                                          background-color: rgb(147, 245, 237);
                                        "
                                      >
                                        <span
                                          style="
                                            background-color: rgb(
                                              147,
                                              245,
                                              237
                                            );
                                          "
                                        >
                                          <span
                                            style="
                                              background-color: rgb(
                                                147,
                                                245,
                                                237
                                              );
                                            "
                                            >&nbsp;List of features:&nbsp;</span
                                          >
                                        </span>
                                      </span>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="list_block block-2"
                              id="list-r5c0m1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 30px;
                                    padding-left: 50px;
                                    padding-right: 20px;
                                    padding-top: 15px;
                                  "
                                >
                                  <div class="levelOne" style="margin-left: 0">
                                    <ul
                                      class="leftList"
                                      start="1"
                                      style="
                                        margin-top: 0;
                                        margin-bottom: 0;
                                        padding: 0;
                                        padding-left: 20px;
                                        color: #555;
                                        font-family: Open Sans, Helvetica Neue,
                                          Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        line-height: 180%;
                                        text-align: left;
                                        mso-line-height-alt: 28.8px;
                                        list-style-type: disc;
                                      "
                                    >
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong
                                            >Centralized Dashboard</strong
                                          >
                                          - Access a comprehensive dashboard
                                          with real-time insights and quick
                                          navigation to essential
                                          features.</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong
                                            >Efficient Course Management</strong
                                          >
                                          - Create, organize, and manage courses
                                          seamlessly with robust tools for
                                          instructors.</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong
                                            >Automated Attendance
                                            Tracking</strong
                                          >
                                          - Simplify attendance with automated
                                          tracking and detailed reports,
                                          reducing manual effort.</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong
                                            >Secure Payment Integration</strong
                                          >
                                          - Streamline fee collection with
                                          integrated, secure payment gateways
                                          for hassle-free transactions.</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong
                                            >Enhanced Communication
                                            Tools</strong
                                          >
                                          - Stay connected with built-in
                                          messaging, email notifications, and
                                          announcements for better
                                          engagement.</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong
                                            >Detailed Analytics and
                                            Reporting</strong
                                          >
                                          - Access detailed insights into
                                          student performance and course
                                          effectiveness with customizable
                                          reports.</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong
                                            >Mobile-Friendly Interface</strong
                                          >
                                          - Manage your institute on the go with
                                          a responsive design accessible from
                                          any device.</span
                                        >
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              class="row row-6"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #f4f4f4;
                padding-top: 10px;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        background-color: #fff;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-left: 5px;
                              padding-right: 5px;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="paragraph_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-left: 35px;
                                    padding-right: 10px;
                                    padding-top: 25px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #444;
                                      font-family: Montserrat, 'Trebuchet MS',
                                        'Lucida Grande', 'Lucida Sans Unicode',
                                        'Lucida Sans', Tahoma, sans-serif;
                                      font-size: 24px;
                                      line-height: 120%;
                                      text-align: left;
                                      mso-line-height-alt: 28.799999999999997px;
                                    "
                                  >
                                    <p
                                      style="margin: 0; word-break: break-word"
                                    >
                                      <span
                                        style="
                                          background-color: rgb(147, 245, 237);
                                        "
                                      >
                                        <span
                                          style="
                                            background-color: rgb(
                                              147,
                                              245,
                                              237
                                            );
                                          "
                                        >
                                          <span
                                            style="
                                              background-color: rgb(
                                                147,
                                                245,
                                                237
                                              );
                                            "
                                            >&nbsp;Login
                                            Information:&nbsp;</span
                                          >
                                        </span>
                                      </span>
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="info_block block-2"
                              id="login-info"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-bottom: 30px;
                                    padding-left: 50px;
                                    padding-right: 20px;
                                    padding-top: 15px;
                                  "
                                >
                                  <div class="levelOne" style="margin-left: 0">
                                    <ul
                                      class="leftList"
                                      start="1"
                                      style="
                                        margin-top: 0;
                                        margin-bottom: 0;
                                        padding: 0;
                                        padding-left: 20px;
                                        color: #555;
                                        font-family: Open Sans, Helvetica Neue,
                                          Helvetica, Arial, sans-serif;
                                        font-size: 16px;
                                        line-height: 180%;
                                        text-align: left;
                                        mso-line-height-alt: 28.8px;
                                        list-style-type: disc;
                                      "
                                    >
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong>Email:</strong>
                                          ${email}
                                          </span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><strong>Password:</strong>
                                        ${password}</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          >Click the link below to
                                          <strong>login</strong> to your
                                          account:</span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          ><a
                                            href="https://learning-management-system-project.emern.netlify.app/"
                                            target="_blank"
                                            style="
                                              color: #0cce7f;
                                              text-decoration: none;
                                            "
                                            >Login to Your Account</a
                                          ></span
                                        >
                                      </li>
                                      <li
                                        style="
                                          margin-bottom: 10px;
                                          text-align: left;
                                        "
                                      >
                                        <span
                                          >For security reasons, please reset
                                          your password once logged in:</span
                                        >
                                      </li>
                                      <!-- <li style="margin-bottom:10px;text-align:left">
                                                                                <span>If you wish to reset your password, click the link below:</span>
                                                                            </li>
                                                                            <li style="margin-bottom:10px;text-align:left">
                                                                                <span><a href="[Password Reset URL]" style="color:#0CCE7F;text-decoration:none;">Reset Password</a></span>
                                                                            </li> -->
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>

            <table
              class="row row-7"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #f4f4f4;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 60px;
                              padding-top: 25px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="button_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="mso-table-lspace: 0; mso-table-rspace: 0"
                            >
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <div
                                      style="
                                        text-decoration: none;
                                        display: inline-block;
                                        color: #fff;
                                        background-color: #3d3bee;
                                        border-radius: 9px;
                                        width: auto;
                                        border-top: 0 solid transparent;
                                        font-weight: undefined;
                                        border-right: 0 solid transparent;
                                        border-bottom: 0 solid transparent;
                                        border-left: 0 solid transparent;
                                        padding-top: 10px;
                                        padding-bottom: 10px;
                                        font-family: Open Sans, Helvetica Neue,
                                          Helvetica, Arial, sans-serif;
                                        font-size: 26px;
                                        text-align: center;
                                        mso-border-alt: none;
                                        word-break: keep-all;
                                      "
                                    >
                                      <span
                                        style="
                                          padding-left: 45px;
                                          padding-right: 45px;
                                          font-size: 26px;
                                          display: inline-block;
                                          letter-spacing: normal;
                                        "
                                      >
                                        <span
                                          style="word-break: break-word"
                                          dir="ltr"
                                        >
                                          <span
                                            style="line-height: 52px"
                                            data-mce-style
                                            dir="ltr"
                                          >
                                            <strong>START NOW</strong>
                                          </span>
                                        </span>
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-8"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #f4f4f4;
                background-image: url(https://d1oco4z2z1fhwp.cloudfront.net/templates/default/286/bg_wave_2.png);
                background-position: top center;
                background-repeat: repeat;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-top: 5px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <div
                              class="spacer_block block-1"
                              style="
                                height: 90px;
                                line-height: 90px;
                                font-size: 1px;
                              "
                            >
                              &#8202;
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table
              class="row row-9"
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="
                mso-table-lspace: 0;
                mso-table-rspace: 0;
                background-color: #fff;
              "
            >
              <tbody>
                <tr>
                  <td>
                    <table
                      class="row-content stack"
                      align="center"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="
                        mso-table-lspace: 0;
                        mso-table-rspace: 0;
                        background-color: #fff;
                        color: #000;
                        width: 700px;
                      "
                      width="700"
                    >
                      <tbody>
                        <tr>
                          <td
                            class="column column-1"
                            width="100%"
                            style="
                              mso-table-lspace: 0;
                              mso-table-rspace: 0;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 35px;
                              padding-top: 15px;
                              vertical-align: top;
                              border-top: 0;
                              border-right: 0;
                              border-bottom: 0;
                              border-left: 0;
                            "
                          >
                            <table
                              class="paragraph_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0;
                                mso-table-rspace: 0;
                                word-break: break-word;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    padding-left: 30px;
                                    padding-right: 30px;
                                    padding-top: 15px;
                                  "
                                >
                                  <div
                                    style="
                                      color: #7c7c7c;
                                      font-family: Open Sans, Helvetica Neue,
                                        Helvetica, Arial, sans-serif;
                                      font-size: 14px;
                                      line-height: 180%;
                                      text-align: center;
                                      mso-line-height-alt: 25.2px;
                                    "
                                  >
                                    <p style="margin: 0">
                                      <strong>project.emern</strong>
                                    </p>
                                    <p style="margin: 0">
                                      29/1, Ambal Nagar, 1st Main Rd, Echankadu,
                                      Kovilambakkam, Chennai, Tamil Nadu 600117
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="social_block block-2"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="mso-table-lspace: 0; mso-table-rspace: 0"
                            >
                              <tr>
                                <td class="pad">
                                  <div class="alignment" align="center">
                                    <table
                                      class="social-table"
                                      width="148px"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                      style="
                                        mso-table-lspace: 0;
                                        mso-table-rspace: 0;
                                        display: inline-block;
                                      "
                                    >
                                      <tr>
                                        <td style="padding: 0 5px 0 0">
                                          <a
                                            href="https://www.facebook.com/project.emerntechnologies23"
                                            target="_blank"
                                          >
                                            <img
                                              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg"
                                              width="32"
                                              height="32"
                                              alt="Facebook"
                                              title="Facebook"
                                              style="
                                                display: block;
                                                height: auto;
                                                border: 0;
                                              "
                                            />
                                          </a>
                                        </td>
                                        <td style="padding: 0 5px 0 0">
                                          <a
                                            href="https://x.com/project.emerntech23"
                                            target="_blank"
                                          >
                                            <img
                                              src="https://upload.wikimedia.org/wikipedia/commons/c/ce/X_logo_2023.svg"
                                              width="32"
                                              height="32"
                                              alt="Twitter"
                                              title="Twitter"
                                              style="
                                                display: block;
                                                height: auto;
                                                border: 0;
                                              "
                                            />
                                          </a>
                                        </td>
                                        <td style="padding: 0 5px 0 0">
                                          <a
                                            href="https://www.instagram.com/project.emerntechnologiespvtltd/"
                                            target="_blank"
                                          >
                                            <img
                                              src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png"
                                              width="32"
                                              height="32"
                                              alt="Instagram"
                                              title="Instagram"
                                              style="
                                                display: block;
                                                height: auto;
                                                border: 0;
                                              "
                                            />
                                          </a>
                                        </td>
                                        <td style="padding: 0 5px 0 0">
                                          <a
                                            href="https://www.youtube.com/channel/UC0DlcC9wr7RU2QX9yVHep4w"
                                            target="_blank"
                                          >
                                            <img
                                              src="https://upload.wikimedia.org/wikipedia/commons/4/42/YouTube_icon_%282013-2017%29.png"
                                              width="32"
                                              height="32"
                                              alt="LinkedIn"
                                              title="LinkedIn"
                                              style="
                                                display: block;
                                                height: auto;
                                                border: 0;
                                              "
                                            />
                                          </a>
                                        </td>
                                      </tr>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- End -->
  </body>
</html>


   `

   return strings
}