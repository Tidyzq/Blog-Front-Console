import React, { StatelessComponent, Fragment } from 'react'
import { connect } from 'react-redux'
import { Form, InputNumber, Input, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import { mapValues } from 'lodash'

import { Setting } from '@/models'
import MainContent from '@/views/MainContent'
import { Portal as HeaderPortal, Breadcrumb, BreadcrumbItem, Button as HeaderButton } from '@/views/Header'
import SelectImageInput from '@/views/SelectImageModal/SelectImageInput'
import withSettings, { WithSettingsComponentProps } from '@/components/withSettings'
import { updateSettings } from '@/store/actions/settings'

export interface SettingsProps extends FormComponentProps, WithSettingsComponentProps {
  updateSettings: typeof updateSettings
}

const formItemLayout = {
  labelCol: {
    sm: { span: 4 },
    xs: { span: 24 },
  },
  wrapperCol: {
    sm: { span: 16 },
    xs: { span: 24 },
  },
}

const Settings: StatelessComponent<SettingsProps> =
({ form: { getFieldDecorator, validateFields }, updateSettings }) => (
  <Fragment>
    <HeaderPortal>
      <Breadcrumb>
        <BreadcrumbItem>Settings</BreadcrumbItem>
      </Breadcrumb>
      <HeaderButton type="primary" onClick={() => {
        validateFields(async (errors, values: Setting) => {
          if (errors) return
          try {
            await updateSettings(values)
            message.success('Settings has been saved')
          } catch (e) {
            message.error(e.message)
            console.error(e)
          }
        })
      }}>Save</HeaderButton>
    </HeaderPortal>
    <MainContent>
      <Form layout="horizontal">
        <Form.Item label="Title:" {...formItemLayout}>
          {getFieldDecorator('title')(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Description:" {...formItemLayout}>
          {getFieldDecorator('description')(
            <Input />,
          )}
        </Form.Item>
        <Form.Item label="Logo:" {...formItemLayout}>
          {getFieldDecorator('logo')(
            <SelectImageInput />,
          )}
        </Form.Item>
        <Form.Item label="Cover:" {...formItemLayout}>
          {getFieldDecorator('cover')(
            <SelectImageInput />,
          )}
        </Form.Item>
        <Form.Item label="Post Per Page" {...formItemLayout}>
          {getFieldDecorator('postPerPage')(
            <InputNumber parser={str => {
              let result = str ? parseInt(str, 10) : 0
              if (Number.isNaN(result)) result = 0
              return result
            }} min={0}/>,
          )}
        </Form.Item>
      </Form>
    </MainContent>
  </Fragment>
)

export default
  withSettings(
    connect(null, {
      updateSettings,
    })(
      Form.create({
        mapPropsToFields: ({ settings }: { settings: Setting | {} }) => mapValues(settings, value => Form.createFormField({ value })),
      })(
        Settings,
      ),
    ),
  )
